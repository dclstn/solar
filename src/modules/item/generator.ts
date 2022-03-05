import {ButtonInteraction, ColorResolvable, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {numberWithCommas} from '../../utils/embed.js';
import {Item, RarityColours} from '../../utils/items.js';
import User from '../../database/user/index.js';
import {emoteStrings} from '../../utils/emotes.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import {createBuyButton, createSellButton} from '../../utils/buttons.js';

const generatorDescription = (item: Item): string => `
Price: ${emoteStrings.gem} **${numberWithCommas(item.price)}**
Level: **${item.level}**
Gems per hour: **${item.gph}/h**
`;

export default async function handleGenerator(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    user = await User.get(interaction.user);

    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(generatorDescription(item))
      .setThumbnail(item.url)
      .setFooter('Some items may leave or join the shop at any time!')
      .setColor(RarityColours[item.rarity] as ColorResolvable);

    const actionRow = new MessageActionRow().addComponents(createBuyButton(user, item), createSellButton(user, item));

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    Sentry.captureException(err);
  }
}
