import {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import {success, warning} from '../../utils/embed.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import redlock, {userLock, groupLock} from '../../redis/locks.js';

export default async function kick(interaction: CommandInteraction) {
  const discordVictim = interaction.options.getUser('user');
  const lock = await redlock.acquire([userLock(discordVictim)], 1000);
  let lockGroup = null;

  try {
    if (discordVictim.id === interaction.user.id) {
      throw new ResponseError('You cannot kick yourself!');
    }

    const id = interaction.user.id as unknown as Mongoose.Schema.Types.Long;
    const kicker = await User.findOne({id}).populate('group');
    const victim = await User.get(discordVictim);

    if (kicker == null || kicker.group == null) {
      throw new ResponseError('You do not belong to a group');
    }

    lockGroup = await redlock.acquire([groupLock(kicker.group.name)], 1000);

    const victimRole = kicker.group.getRole(victim);
    const kickerRole = kicker.group.getRole(kicker);

    if (victimRole == null) {
      throw new ResponseError('Could not find user in group');
    }

    if (kickerRole <= victimRole) {
      throw new ResponseError('Cannot kick someone the same/lower role');
    }

    kicker.group.rem(victim);
    await Promise.all([victim.save(), kicker.group.save()]);

    interaction.reply({
      embeds: [success(`Kicked **${victim.username}** from group!`)],
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

    if (lockGroup != null) {
      lockGroup.release();
    }
  }
}
