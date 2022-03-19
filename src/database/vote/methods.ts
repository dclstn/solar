import Mongoose from 'mongoose';
import ResponseError from '../../utils/error.js';
import {VotingInterface} from '../../types/vote.js';
import User from '../user/index.js';
import {success} from '../../utils/embed.js';
import {ItemIds, Items} from '../../utils/items.js';
import redlock, {userLockId} from '../../redis/locks.js';
import webhook from '../../webhook.js';

export async function addVote(providerId: string) {
  this[providerId].lastVoted = new Date();
  await this.save();
}

export async function validateVotes(this: VotingInterface) {
  if (!this.rewardable) {
    throw new ResponseError('You cannot yet redeem a reward!');
  }

  if (!this.topGG.hasVoted) {
    throw new ResponseError('You must vote on Top.GG!');
  }

  if (!this.discordBotList.hasVoted) {
    throw new ResponseError('You must vote on discordbotlist.com!');
  }

  const lock = await redlock.acquire([userLockId(this.discordId)], 1000);

  let user = null;
  const gift = Items[ItemIds.GIFT];
  try {
    const id = String(this.discordId) as unknown as Mongoose.Schema.Types.Long;
    user = await User.findOne({discordId: id});

    if (user == null) {
      return;
    }

    user.add(gift, 1);
    await user.save();
  } finally {
    await lock.release();
  }

  this.lastReward = new Date();
  await this.save();

  await webhook.send({
    content: `<@${this.discordId}>, thank you for voting!`,
    embeds: [success(`<@${this.discordId}> just completed their votes and recieved a **Gift** ${gift.emoji}!`)],
  });
}
