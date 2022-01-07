import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {Chances, Item} from '../../items.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import {createUnboxButton} from '../../utils/buttons.js';

const GIFT_DESCRIPTION = `
**Drop Rates:**
\`\`\`
${Chances['0'] * 100}% Chance of Common
${Chances['1'] * 100}% Chance of Uncommon
${Chances['2'] * 100}% Chance of Epic
${Chances['3'] * 100}% Chance of Legendary
\`\`\`
`;

export default async function handleGift(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    user = await User.get(interaction.user);

    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(GIFT_DESCRIPTION)
      .setThumbnail(item.url)
      .setColor('GOLD');

    const actionRow = new MessageActionRow().addComponents(createUnboxButton(user, item));

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    Sentry.captureException(err);
  }
}
