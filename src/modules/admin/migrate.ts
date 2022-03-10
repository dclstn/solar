import type {CommandInteraction} from 'discord.js';
import _ from 'lodash';
import User from '../../database/user/index.js';
import kingdoms from './kingdoms.js';
import Group from '../../database/group/index.js';
import users from './users.js';
import Sentry from '../../sentry.js';
import {Roles} from '../../utils/enums.js';

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
            discordId,
          },
          // If you wanted it to be incremented rather than replace the field, then try `$inc` instead of `$set`.
          update: {$set: {discordId, username}},
          upsert: true,
        },
      });
    }
    await User.collection.bulkWrite(bulkWrite);

    kingdoms.forEach(async (kingdom) => {
      if (userObj[kingdom.king.$oid] == null) {
        return;
      }

      const userIds = [
        ...kingdom.users.map((user) => userObj[user.$oid].discordId),
        userObj[kingdom.king.$oid].discordId,
      ];
      const kingdomUsers = await User.find({discordId: {$in: userIds}});

      const group = await Group.create({
        name: kingdom.name,
        users: kingdomUsers.map((user) => ({
          user: user._id,
          role: userObj[kingdom.king.$oid].discordId === String(user.discordId) ? Roles.OWNER : Roles.USER,
        })),
      });

      await Promise.all([group.save(), User.updateMany({discordId: {$in: userIds}}, {group: group._id})]);
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
