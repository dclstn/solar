import {CommandInteraction} from 'discord.js';
import redlock, {userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

import {numberWithCommas, slotsWin, slotsLose, warning} from '../../utils/embed.js';
import {SLOT_ITEMS, Item} from '../../utils/items.js';
import {secureMathRandom} from '../../utils/misc.js';

const SYMBOL_LIST = Object.values(SLOT_ITEMS);

export default async function spinSlots(interaction: CommandInteraction) {
  const wager = interaction.options.getInteger('wager');
  const symbols: Item[][] = [];

  for (let i = 0; i < 5; i += 1) {
    symbols.push([]);
    for (let j = 0; j < 3; j += 1) {
      symbols[i].push(SYMBOL_LIST[Math.floor(secureMathRandom() * SYMBOL_LIST.length)]);
    }
  }

  // It would probably be more efficient on average for larger arrays to use a hashmap to store counts, but this
  // list will only ever be 3 items long, so it doesn't really matter too much I guess. Might even be able to do it
  // with only 3 checks (compare 0 & 1, 1 & 2, 2 & 0 and if only one is true, then that's a x2, if all are true, that's
  // a x3, and if none are true, then there is no combo), but I'll get this done and then think about it for a bit and make sure it checks out after.
  // - Josh
  //
  // 1. Of middle row (symbols[2])
  // 2. Map each item in middle row to the number of occurences of that item in the row
  // 3. Get max of the new list of counts
  const multiplier = Math.max(...symbols[2].map((item, i, arr) => arr.filter((_item) => _item.id === item.id).length));

  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const user = await User.get(interaction.user);

    if (user.money <= wager) {
      throw new ResponseError('You do not have enough funds');
    }

    if (multiplier > 1) {
      user.updateBalance(wager * (multiplier - 1));
      await user.save();

      interaction.reply({
        embeds: [slotsWin(symbols, multiplier, numberWithCommas(wager * multiplier))],
      });
    } else {
      user.updateBalance(wager * -1);
      await user.save();

      interaction.reply({
        embeds: [slotsLose(symbols, numberWithCommas(wager))],
      });
    }
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
