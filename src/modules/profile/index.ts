import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {ButtonInteraction, CommandInteraction, MessageEmbed, User} from 'discord.js';
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
    .setDescription(createProfileDescription(user, gridString))
    .setColor('BLURPLE')
    .setTimestamp(new Date())
    .setFooter(InventoryType[inventoryType]);
}

class Profile {
  constructor() {
    commands.on(CommandNames.PROFILE, this.handleCommand);
    commands.on(UserCommandNames.PROFILE, this.handleCommand);
    components.on(MessageComponentIds.PROFILE, this.handleButton);
  }

  async handleCommand(interaction: CommandInteraction) {
    try {
      const user = interaction.options.getUser('user') || interaction.user;
      const inventory = interaction.options.getInteger('inventory') || InventoryType.Main;
      const embed = await createEmbed(user, inventory);

      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  async handleButton(interaction: ButtonInteraction) {
    try {
      const {user} = interaction;
      const embed = await createEmbed(user, InventoryType.Main);

      interaction.reply({
        ephemeral: true,
        embeds: [embed],
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
