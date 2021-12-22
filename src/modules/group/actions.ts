import User, {UserInterface} from 'database/user/index.js';
import {CommandInteraction} from 'discord.js';
import Sentry from '../../sentry.js';
import Group from '../../database/group/index.js';

export default async function create(interaction: CommandInteraction) {
  //   let user: UserInterface;
  //   try {
  //     const user = await User.get(interaction.user);
  //   } catch (err) {
  //     Sentry.captureException(err);
  //   }
}

// export function deposit(interaction: CommandInteraction) {}
