import Mongoose from 'mongoose';
import moment from 'moment';
import ResponseError from '../../utils/error.js';
import {VotingInterface} from '../../types/vote.js';
import User from '../user/index.js';
import {success} from '../../utils/embed.js';
import {ItemIds, Items} from '../../utils/items.js';
import redlock, {userLockId} from '../../redis/locks.js';
import webhook from '../../webhook.js';
import Cooldown from '../cooldown/index.js';

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
  let cooldown = null;
  const gift = Items[ItemIds.GIFT];

  try {
    const id = String(this.discordId) as unknown as Mongoose.Schema.Types.Long;
    [user, cooldown] = await Promise.all([User.findOne({discordId: id}), Cooldown.get(id)]);

    if (user == null || cooldown == null) {
      return;
    }

    cooldown.set('voting.endDate', moment(new Date()).add(12, 'hours').toDate());
    cooldown.set('voting.notified', false);

    user.add(gift, 1);
    await Promise.all([user.save(), cooldown.save()]);
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
