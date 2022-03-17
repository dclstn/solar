import type {CommandInteraction} from 'discord.js';
import _ from 'lodash';
import Group from '../../database/group/index.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';

export default async function migrate(interaction: CommandInteraction) {
  try {
    interaction.reply('Migrated');

    const groups = await Group.find({});

    for await (const group of groups) {
      // eslint-disable-next-line no-continue
      if (group.users.length === 0) continue;
      await User.updateMany(
        {
          _id: {
            $in: group.users.map(({user}) => user),
          },
        },
        {group: group._id}
      );
    }
  } catch (err) {
    Sentry.captureException(err);
  }
}
