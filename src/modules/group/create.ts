/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {CommandInteraction} from 'discord.js';
import {success, warning} from '../../utils/embed.js';
import redlock, {userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import {createGroup} from '../../utils/group.js';

export default async function create(interaction: CommandInteraction) {
  let user: UserInterface;

  const name = interaction.options.getString('name');
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    user = await User.get(interaction.user);
    await createGroup(user, name);
    interaction.reply({embeds: [success('Successfully created kingdom')], ephemeral: true});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    lock.release();
  }
}
