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
import {findById} from '../../items.js';
import {InventoryType} from '../../utils/enums.js';
import {emoteStrings} from '../../utils/emotes.js';
import {STORAGE_BUTTON, PROFILE_BUTTON, SHOP_BUTTON} from '../../utils/buttons.js';

const createProfileDescription = (user: UserInterface, grid: string) => `

${emoteStrings.gem} Gems: **${numberWithCommas(user.money)}**
💰 Gems Per Hour: **${numberWithCommas(user.getInventory(InventoryType.Main).gph())}**

${grid}
`;

async function createEmbed(interactionUser: User, inventoryType: number): Promise<MessageEmbed> {
  const user = await UserModel.get(interactionUser);
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
      const user = interaction.options.getUser('user') || interaction.user;
      const inventory = interaction.options.getInteger('inventory') || InventoryType.Main;
      const embed = await createEmbed(user, inventory);

      const actionRow = new MessageActionRow().addComponents(
        SHOP_BUTTON,
        inventory === InventoryType.Main ? STORAGE_BUTTON : PROFILE_BUTTON
      );

      interaction.reply({
        ephemeral: true,
        embeds: [embed],
        components: [actionRow],
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  async handleButton(interaction: ButtonInteraction, inventoryType: InventoryType) {
    try {
      const {user} = interaction;
      const embed = await createEmbed(user, inventoryType);

      const actionRow = new MessageActionRow().addComponents(
        SHOP_BUTTON,
        inventoryType === InventoryType.Main ? STORAGE_BUTTON : PROFILE_BUTTON
      );

      interaction.reply({
        ephemeral: true,
        embeds: [embed],
        components: [actionRow],
      });
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
