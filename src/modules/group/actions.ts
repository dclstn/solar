import type {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import {emoteStrings} from '../../utils/emotes.js';
import {numberWithCommas, success, warning} from '../../utils/embed.js';
import redlock, {groupLock, userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import {createGroup} from '../../utils/group.js';

mongooseLong(Mongoose);

export async function create(interaction: CommandInteraction) {
  let user: UserInterface;

  const name = interaction.options.getString('name');
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    user = await User.get(interaction.user);
    await createGroup(user, name);
    interaction.reply({embeds: [success(user, 'Successfully created kingdom')], ephemeral: true});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    lock.release();
  }
}

export async function deposit(interaction: CommandInteraction) {
  let user: UserInterface;

  const amount = interaction.options.getInteger('amount');
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  let userGroupLock = null;

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      embeds: [
        success(user, `Successfully deposited ${emoteStrings.gem} **${numberWithCommas(amount)}** into ${group.name}`),
      ],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
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
