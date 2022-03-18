import ResponseError from '../../utils/error.js';
import {VotingInterface} from '../../types/vote.js';
import User from '../user/index.js';
import client from '../../client.js';
import {success} from '../../utils/embed.js';
import {ItemIds, Items} from '../../utils/items.js';
import redlock, {userLock} from '../../redis/locks.js';
import webhook from '../../webhook.js';

export async function addVote(providerId: string) {
  this.set(`${providerId}.lastVoted`, new Date());

  await this.validateVotes();

  await this.save();
}

export async function validateVotes(this: VotingInterface) {
  if (!this.rewardable) {
    throw new ResponseError('You cannot yet redeem a reward');
  }

  if (!this.topGG.hasVoted) {
    throw new ResponseError('You must vote on Top.GG!');
  }

  // they're sending a OPTIONS request for some reason?
  // if (!this.discordBotList.hasVoted) {
  //   throw new ResponseError('You must vote on discordbotlist.com!');
  // }

  const discordUser = await client.users.fetch(String(this.discordId));
  const lock = await redlock.acquire([userLock(discordUser)], 1000);

  let user = null;
  const gift = Items[ItemIds.GIFT];
  try {
    user = await User.get(discordUser);
    user.add(gift, 1);
    await user.save();
  } finally {
    await lock.release();
  }

  this.lastReward = new Date();
  await this.save();

  try {
    await discordUser.send({embeds: [success('Thank you for voting!')]});
  } catch (err) {}

  await webhook.send({
    content: `<@${user.discordId}>, thank you for voting!`,
    embeds: [success(`${user.username} just completed their votes and recieved a **Gift** ${gift.emoji}!`)],
  });
}
