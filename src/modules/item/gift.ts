import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {Item} from '../../utils/items.js';
import User from '../../database/user/index.js';
import {BuyType, UserInterface} from '../../types/user.js';
import Sentry from '../../lib/sentry.js';
import {createBuyButton, createUnboxButton} from '../../utils/buttons.js';
import ResponseError from '../../utils/error.js';

export default async function handleGift(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    if (item == null) {
      throw new ResponseError('invalid item');
    }

    user = await User.get(interaction.user);

    const embed = new MessageEmbed()
      .setImage(item.url)
      .setColor('GOLD')
      .setFooter({text: 'Guaranteed legendary / epic every 5 gifts!'});

    const actionRow = new MessageActionRow().addComponents(
      createBuyButton(user, item, BuyType.GEMS),
      createUnboxButton(user, item)
    );

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    Sentry.captureException(err);
  }
}
