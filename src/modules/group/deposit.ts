/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {CommandInteraction} from 'discord.js';
import {emoteStrings} from '../../utils/emotes.js';
import {numberWithCommas, success, warning} from '../../utils/embed.js';
import redlock, {groupLock, userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import type {GroupInterface} from '../../types/group.js';

const depositDescription = (amount: number, group: GroupInterface) =>
  `Successfully deposited ${emoteStrings.gem} **${numberWithCommas(amount)}** into ${group.name}`;

export default async function deposit(interaction: CommandInteraction) {
  let user: UserInterface;

  const amount = interaction.options.getInteger('amount');
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  let userGroupLock = null;

  try {
    // @ts-ignore
    user = await User.findOne({id: interaction.user.id}).populate('group');

    if (user == null || user.group == null) {
      throw new ResponseError('You do not belong to a kingdom');
    }

    if (user.money < amount) {
      throw new ResponseError('You do not have that many gems');
    }

    const {group} = user;
    userGroupLock = await redlock.acquire([groupLock(group.name)], 1000);

    group.set('money', (group.money += amount));
    user.set('money', (user.money -= amount));

    await Promise.all([user.save(), group.save()]);

    interaction.reply({
      embeds: [success(depositDescription(amount, group))],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    lock.release();
    if (userGroupLock) {
      userGroupLock.release();
    }
  }
}
