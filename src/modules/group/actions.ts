import {CommandInteraction} from 'discord.js';
import {acquireUserLock} from '../../redis/locks.js';
import User, {UserInterface} from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import Group from '../../database/group/index.js';

export async function create(interaction: CommandInteraction) {
  let user: UserInterface;

  const lock = await acquireUserLock(interaction.user.id, 1000);
  const name = interaction.options.getString('name');

  try {
    user = await User.get(interaction.user);

    const group = await Group.create({
      name,
      users: [user._id],
    });

    user.group = group._id;

    await user.save();
  } catch (err) {
    Sentry.captureException(err);
  } finally {
    lock.release();
  }
}

export async function deposit(interaction: CommandInteraction) {
  let user: UserInterface;
  try {
    user = await User.get(interaction.user);
  } catch (err) {
    Sentry.captureException(err);
  }
}
