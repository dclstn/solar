import type {CommandInteraction} from 'discord.js';
import _ from 'lodash';
import User from '../../database/user/index.js';
import kingdoms from './kingdoms.js';
import Group from '../../database/group/index.js';
import users from './users.js';
import Sentry from '../../sentry.js';

export default async function migrate(interaction: CommandInteraction) {
  try {
    interaction.reply('Migrated');

    const userObj = {};
    _.uniqBy(users, 'discordId')
      .filter((user) => user.lastKnownUsername != null)
      .forEach(async (user) => {
        userObj[user._id.$oid] = {
          username: user.lastKnownUsername,
          discordId: user.discordId,
        };
      });

    const bulkWrite = [];
    // @ts-ignore
    for (const {username, discordId} of Object.values(userObj)) {
      bulkWrite.push({
        updateOne: {
          filter: {
            discordId: parseInt(discordId, 10),
          },
          // If you wanted it to be incremented rather than replace the field, then try `$inc` instead of `$set`.
          update: {$set: {discordId: parseInt(discordId, 10), username}},
          upsert: true,
        },
      });
    }
    await User.collection.bulkWrite(bulkWrite);

    kingdoms.forEach(async (kingdom) => {
      const group = await Group.findOne({name: kingdom.name});

      if (userObj[kingdom.king.$oid] == null || group == null) {
        return;
      }

      const userIds = [
        ...kingdom.users.map((user) => parseInt(userObj[user.$oid].discordId, 10)),
        parseInt(userObj[kingdom.king.$oid].discordId, 10),
      ];

      await User.updateMany({discordId: {$in: userIds}}, {group: group._id});
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
