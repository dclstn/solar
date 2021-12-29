import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {Item} from '../../items.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import {createUnboxButton} from '../../utils/buttons.js';

const generatorDescription = (item: Item): string => `
*${item.name}*
`;

export default async function handleGift(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    user = await User.get(interaction.user);

    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(generatorDescription(item))
      .setThumbnail(item.url)
      .setColor('GOLD');

    const actionRow = new MessageActionRow().addComponents(createUnboxButton(user, item));

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    Sentry.captureException(err);
  }
}
