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
    const userObj = {};
    _.uniqBy(users, 'discordId')
      .filter((user) => user.lastKnownUsername != null)
      .forEach((user) => {
        userObj[user._id.$oid] = {
          username: user.lastKnownUsername,
          discordId: user.discordId,
        };
      });

    const usersMap = Object.values(userObj);
    await User.insertMany(usersMap);

    kingdoms.forEach(async (kingdom) => {
      const userIds = [
        ...kingdom.users.map((user) => userObj[user.$oid].discordId),
        userObj[kingdom.king.$oid].discordId,
      ];
      const kingdomUsers = await User.find({discordId: {$in: userIds}});

      const group = await Group.create({
        name: kingdom.name,
        users: kingdomUsers.map((user) => ({
          user: user._id,
          role: userObj[kingdom.king.$oid].discordId === user.discordId ? Roles.OWNER : Roles.USER,
        })),
      });

      await Promise.all([group.save(), User.updateMany({discordId: {$in: userIds}}, {group: group._id})]);
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
