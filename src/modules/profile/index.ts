import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
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

const createProfileDescription = (user: UserInterface, grid: string) => `

${emoteStrings.gem} Gems: **${numberWithCommas(user.money)}**
💰 Gems Per Hour: **${numberWithCommas(user.getInventory(InventoryType.Main).gph())}**
${user.group != null ? `🏰 Group: **${user.group.name}**\n` : ''}
${grid}
`;

async function createEmbed(user: UserInterface, inventoryType: number): Promise<MessageEmbed> {
  const inventory = user.getInventory(inventoryType);
  await user.populate('group');
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

function handleReply(
  user: UserInterface,
  interaction: CommandInteraction | ButtonInteraction,
  isPersonal: boolean,
  embed: MessageEmbed,
  inventory: InventoryType
) {
  const hasGift = user.has(Items[ItemIds.GIFT]);
  interaction.reply({
    ephemeral: true,
    embeds: [embed],
    ...(isPersonal
      ? {
          components: [
            new MessageActionRow().addComponents(
              inventory === InventoryType.Main ? STORAGE_BUTTON : PROFILE_BUTTON,
              SHOP_BUTTON,
              ...(hasGift ? [createItemButton(Items[ItemIds.GIFT])] : [])
            ),
          ],
        }
      : {}),
  });
}

async function handleCommand(interaction: CommandInteraction, inventoryType = InventoryType.Main) {
  try {
    const discordUser = interaction.options.getUser('user') || interaction.user;
    const isPersonal = discordUser === interaction.user;
    const inventory = interaction.options.getInteger('inventory') || inventoryType;
    const user = await UserModel.get(discordUser);
    const embed = await createEmbed(user, inventory);
    handleReply(user, interaction, isPersonal, embed, inventory);
  } catch (err) {
    Sentry.captureException(err);
  }
}

async function handleButton(interaction: ButtonInteraction, inventoryType: InventoryType) {
  try {
    const {user: discordUser} = interaction;
    const user = await UserModel.get(discordUser);
    const embed = await createEmbed(user, inventoryType);
    handleReply(user, interaction, true, embed, inventoryType);
  } catch (err) {
    Sentry.captureException(err);
  }
}

commands.on(CommandNames.PROFILE, handleCommand);
commands.on(UserCommandNames.PROFILE, handleCommand);
components.on(MessageComponentIds.PROFILE, (interaction) => handleButton(interaction, InventoryType.Main));

commands.on(CommandNames.STORAGE, (interaction) => handleCommand(interaction, InventoryType.Storage));
commands.on(UserCommandNames.STORAGE, (interaction) => handleCommand(interaction, InventoryType.Storage));
components.on(MessageComponentIds.STORAGE, (interaction) => handleButton(interaction, InventoryType.Storage));

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.PROFILE,
  description: CommandDescriptions[CommandNames.PROFILE],
  options: CommandOptions[CommandNames.PROFILE],
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.STORAGE,
  description: CommandDescriptions[CommandNames.STORAGE],
  options: CommandOptions[CommandNames.STORAGE],
});

commands.registerCommand({
  type: ApplicationCommandTypes.USER,
  name: UserCommandNames.PROFILE,
});

commands.registerCommand({
  type: ApplicationCommandTypes.USER,
  name: UserCommandNames.STORAGE,
});
