import type {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import {emoteStrings} from '../../utils/emotes.js';
import {numberWithCommas, success, warning} from '../../utils/embed.js';
import redlock, {groupLock, userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import type {GroupInterface} from '../../types/group.js';

const depositDescription = (group: GroupInterface, amount: number) =>
  `Successfully deposited ${emoteStrings.gold} **${numberWithCommas(amount)}** into ${group.name}`;

export default async function deposit(interaction: CommandInteraction) {
  const amount = interaction.options.getInteger('amount');
  let acquiredUserLock = null;
  let acquiredGroupLock = null;

  try {
    acquiredUserLock = await redlock.acquire([userLock(interaction.user)], 1000);

    const id = interaction.user.id as unknown as Mongoose.Schema.Types.Long;
    const user = await User.findOne({discordId: id}).populate('group');

    if (user.group == null) {
      throw new ResponseError('You do not belong to a group');
    }

    acquiredGroupLock = await redlock.acquire([groupLock(user.group.name)], 1000);

    user.deposit(user.group, amount);
    await Promise.all([user.save(), user.group.save()]);

    interaction.reply({
      embeds: [success(depositDescription(user.group, amount))],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    acquiredUserLock.release();
    if (acquiredGroupLock) acquiredGroupLock.release();
  }
}
