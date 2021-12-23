import type {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';
import {success, warning} from '../../utils/embed.js';
import redlock, {userLock} from '../../redis/locks.js';
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

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = Mongoose.Schema.Types.Long.fromString(interaction.user.id);
    const group = await User.findOne({id}).populate('group');

    console.log(group);

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
