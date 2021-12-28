import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {numberWithCommas} from '../../utils/embed.js';
import {MessageComponentIds} from '../../constants.js';
import {Item} from '../../items.js';
import User from '../../database/user/index.js';
import {emoteStrings} from '../../utils/emotes.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';

const generatorDescription = (item: Item): string => `
Price: ${emoteStrings.gem} **${numberWithCommas(item.price)}**
Level: **${item.level}**
Gems per hour: **${item.gph}/h**
`;

export default async function handleGift(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    user = await User.get(interaction.user);

    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(generatorDescription(item))
      .setThumbnail(item.url)
      .setFooter('Some items may leave or join the shop at any time!')
      .setColor('GOLD');

    const actionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(MessageComponentIds.UNBOX)
        .setLabel('Unbox')
        .setStyle('SUCCESS')
        .setEmoji(item.emojiId)
        .setDisabled(!user.has(item))
    );

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    Sentry.captureException(err);
  }
}
