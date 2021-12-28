import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed, User} from 'discord.js';
import chunk from 'lodash.chunk';
import {numberWithCommas} from '../../utils/embed.js';
import {
  CommandNames,
  CommandDescriptions,
  CommandOptions,
  UserCommandNames,
  MessageComponentIds,
  Defaults,
} from '../../constants.js';
import commands from '../../commands.js';
import UserModel from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import components from '../../components.js';
import Sentry from '../../sentry.js';
import {findById, ItemIds, Items} from '../../items.js';
import {InventoryType} from '../../utils/enums.js';
import {emoteStrings} from '../../utils/emotes.js';
import {STORAGE_BUTTON, PROFILE_BUTTON, SHOP_BUTTON, createItemButton} from '../../utils/buttons.js';

const RARE = Items[ItemIds.RARE];
const EPIC = Items[ItemIds.EPIC];
const LEGENDARY = Items[ItemIds.LEGENDARY];

const createProfileDescription = (user: UserInterface, grid: string) => `

${emoteStrings.gem} Gems: **${numberWithCommas(user.money)}**
💰 Gems Per Hour: **${numberWithCommas(user.getInventory(InventoryType.Main).gph())}**

${grid}
`;

async function createEmbed(user: UserInterface, inventoryType: number): Promise<MessageEmbed> {
  const inventory = user.getInventory(inventoryType);

  const grid = chunk(new Array(Defaults.MAX_SLOTS).fill(emoteStrings.blank), Math.sqrt(Defaults.MAX_SLOTS));

  inventory.items.forEach(({cords, id}) => {
    grid[cords.y][cords.x] = findById(id).emoji;
  });

  const gridString = grid.map((row: Array<string>) => row.join(' ')).join('\n');

  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setDescription(inventoryType === InventoryType.Main ? createProfileDescription(user, gridString) : gridString)
    .setColor('BLURPLE')
    .setTimestamp(new Date())
    .setFooter(`Lvl ${user.level} • ${InventoryType[inventoryType]}`);
}

class Profile {
  constructor() {
    commands.on(CommandNames.PROFILE, this.handleCommand);
    commands.on(UserCommandNames.PROFILE, this.handleCommand);
    components.on(MessageComponentIds.PROFILE, (interaction) => this.handleButton(interaction, InventoryType.Main));
    components.on(MessageComponentIds.STORAGE, (interaction) => this.handleButton(interaction, InventoryType.Storage));
  }

  async handleCommand(interaction: CommandInteraction) {
    try {
      const discordUser = interaction.options.getUser('user') || interaction.user;
      const isPersonal = discordUser === interaction.user;
      const inventory = interaction.options.getInteger('inventory') || InventoryType.Main;

      const user = await UserModel.get(discordUser);
      const embed = await createEmbed(user, inventory);

      const hasRare = user.has(RARE);
      const hasEpic = user.has(EPIC);
      const hasLegendary = user.has(LEGENDARY);
      const hasAny = hasRare || hasEpic || hasLegendary;

      interaction.reply({
        ephemeral: true,
        embeds: [embed],
        ...(isPersonal
          ? {
              components: [
                new MessageActionRow().addComponents(
                  SHOP_BUTTON,
                  inventory === InventoryType.Main ? STORAGE_BUTTON : PROFILE_BUTTON
                ),
                ...(hasAny
                  ? [
                      new MessageActionRow().addComponents(
                        ...(hasRare ? [createItemButton(RARE)] : []),
                        ...(hasEpic ? [createItemButton(EPIC)] : []),
                        ...(hasLegendary ? [createItemButton(LEGENDARY)] : [])
                      ),
                    ]
                  : []),
              ],
            }
          : {}),
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  async handleButton(interaction: ButtonInteraction, inventoryType: InventoryType) {
    try {
      const {user: discordUser} = interaction;

      const user = await UserModel.get(discordUser);
      const embed = await createEmbed(user, inventoryType);

      interaction.reply({ephemeral: true, embeds: [embed]});
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.PROFILE,
  description: CommandDescriptions[CommandNames.PROFILE],
  options: CommandOptions[CommandNames.PROFILE],
});

commands.registerCommand({
  type: ApplicationCommandTypes.USER,
  name: UserCommandNames.PROFILE,
});

export default new Profile();
