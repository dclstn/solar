import {ButtonInteraction} from 'discord.js';
import redlock, {userLock} from '../../redis/locks.js';
import {Item, Items} from '../../items.js';
import {ItemTypes} from '../../utils/enums.js';
import components from '../../components.js';
import {MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import {warning} from '../../utils/embed.js';

const GIFTS = Object.values(Items).filter(({type}) => type === ItemTypes.GIFT);

async function unboxGift(interaction: ButtonInteraction, gift: Item) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const user = await User.get(interaction.user);
    user.unbox(gift);
    await user.save();

    interaction.reply('Successfully unboxed');
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
}

GIFTS.forEach((gift) =>
  components.on(`${MessageComponentIds.UNBOX}.${gift.id}`, (interaction: ButtonInteraction) => {
    unboxGift(interaction, gift);
  })
);
