/* eslint-disable import/prefer-default-export */
import {User} from 'discord.js';
import moment from 'moment';
import Mongoose from 'mongoose';
import type {RaidCreateInterface, RaidResultInterface} from '../../types/raid.js';
import client from '../../redis/client.js';
import ResponseError from '../../utils/error.js';
import UserModel from '../user/index.js';
import {secureMathRandom} from '../../utils/misc.js';
import Sentry from '../../sentry.js';
import redlock, {userLock} from '../../redis/locks.js';

const {duration} = moment;

const RAID_TIMEOUT = 10000;

export async function get(discordId: Mongoose.Schema.Types.Long) {
  return this.findOneAndUpdate(
    {
      discordId,
    },
    {},
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function completeRaid(sessionId: string, targetUser: User): Promise<RaidResultInterface> {
  const raiderIds = await client.lrange(sessionId, 0, -1);
  const [users, target] = await Promise.all([UserModel.find({discordId: {$in: raiderIds}}), UserModel.get(targetUser)]);

  if (users.length === 0) {
    return {success: false, raiders: [], target};
  }

  const chance = 0.5 + (users.length - 1) * 0.05;
  const success = secureMathRandom() <= chance;

  let split = null;
  let stolen = null;

  if (success) {
    stolen = 0.15 * target.money;
    target.set('money', target.money - stolen);

    split = stolen / users.length;
    await Promise.all([
      UserModel.updateMany(
        {
          discordId: {$in: raiderIds},
        },
        {$inc: {money: split}}
      ),
      target.save(),
    ]);
  }

  return {
    success,
    raiders: users,
    target,
    stolen,
    split,
  };
}

export async function createRaid(meta: RaidCreateInterface) {
  const {target, user, onComplete} = meta;
  const [userModel, targetModel] = await Promise.all([UserModel.get(user), UserModel.get(target)]);

  if (!userModel.pvp.enabled) {
    throw new ResponseError('You must enable pvp first `/pvp True`');
  }

  if (!targetModel.pvp.enabled) {
    throw new ResponseError('Target must enable pvp first');
  }

  if (target.id === user.id) {
    throw new ResponseError('You cannot raid yourself');
  }

  const [targetRaid, userRaid] = await Promise.all([this.get(target.id), this.get(user.id)]);

  if (!userRaid.canRaid) {
    const waitingTime = moment(userRaid.lastRaided).add(1, 'hours').diff(new Date(), 'seconds');
    throw new ResponseError(
      `This user isnt currently raidable, available in ${duration(waitingTime, 'seconds').humanize()}`
    );
  }

  if (!targetRaid.isRaidable) {
    const waitingTime = moment(targetRaid.lastRaided).add(1, 'hours').diff(new Date(), 'seconds');
    throw new ResponseError(
      `This user isnt currently raidable, available in ${duration(waitingTime, 'seconds').humanize()}`
    );
  }

  targetRaid.set('lastRaided', new Date());
  userRaid.set('lastRaid', new Date());

  const sessionId = targetRaid.discordId;
  await Promise.all([client.lpush(sessionId, userRaid.discordId), targetRaid.save(), userRaid.save()]);

  setTimeout(async () => {
    const lock = await redlock.acquire([userLock(target)], 1000);

    try {
      const raidResult = await completeRaid(sessionId, target);

      if (onComplete != null) {
        onComplete(raidResult);
      }
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      await lock.release();
    }
  }, RAID_TIMEOUT);

  return sessionId;
}

export async function joinRaid(sessionId: string, user: User) {
  const userModel = await UserModel.get(user);

  if (!userModel.pvp.enabled) {
    throw new ResponseError('You must enabled **PVP** first, `/pvp True`');
  }

  if (sessionId === user.id) {
    throw new ResponseError('You cannot raid yourself!');
  }

  if (!(await client.exists(sessionId))) {
    throw new ResponseError('This raid session has expired');
  }

  const users = await client.lrange(sessionId, 0, -1);

  if (users.includes(user.id)) {
    throw new ResponseError('You already belong to this raid');
  }

  await client.lpush(sessionId, user.id);
}

export async function leaveRaid(sessionId: string, user: User) {
  if (!(await client.exists(sessionId))) {
    throw new ResponseError('This raid session has expired');
  }

  const users = await client.lrange(sessionId, 0, -1);

  if (!users.includes(user.id)) {
    throw new ResponseError("You don't belong to this raid");
  }

  await client.lrem(sessionId, 0, user.id);
}
