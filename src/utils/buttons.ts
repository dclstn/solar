import {MessageButton} from 'discord.js';
import {Item, Items} from './items.js';
import {MessageComponentIds} from '../constants.js';
import {emoteIds} from './emotes.js';
import {ItemTypes} from './enums.js';
import {BuyType, UserInterface} from '../types/user.js';
import {numberWithCommas} from './embed.js';
import type {GroupInterface} from '../types/group.js';

export const PROFILE_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.PROFILE)
  .setEmoji(emoteIds.rucksack)
  .setStyle('PRIMARY')
  .setLabel('My Profile');

export const STORAGE_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.STORAGE)
  .setEmoji(emoteIds.rucksack)
  .setStyle('PRIMARY')
  .setLabel('My Storage');

export const SHOP_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.SHOP)
  .setStyle('PRIMARY')
  .setLabel('Shop')
  .setEmoji(emoteIds.shopping);

export const VALIDATE_VOTES_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.VALIDATE_VOTES)
  .setStyle('PRIMARY')
  .setLabel('Claim Reward');

export const VOTE_TOPGG = new MessageButton()
  .setStyle('LINK')
  .setURL(`https://top.gg/bot/757120026867138580/vote`)
  .setLabel('Vote Top.GG');

export const VOTE_DBL = new MessageButton()
  .setStyle('LINK')
  .setURL('https://discordbotlist.com/bots/castle-mania/upvote')
  .setLabel('Vote DiscordBotList.com');

export const INVITE_BOT = new MessageButton()
  .setStyle('LINK')
  .setURL('https://castlemania.bot/invite')
  .setEmoji(emoteIds.gem)
  .setLabel('Reinvite Castle Mania with Correct Permissions');

export const BUY_GEMS = new MessageButton()
  .setStyle('LINK')
  .setURL('https://castlemania.bot/store')
  .setEmoji(emoteIds.gem)
  .setLabel('Purchase Gems');

export const createToggleNotificationButton = (type: string) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.TOGGLE_NOTIFICATION}.${type}`)
    .setStyle('PRIMARY')
    .setLabel('Notify me')
    .setEmoji('552927522824781834');

export const createAcceptButton = (group: GroupInterface) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.ACCEPT_INVITE}.${group._id}`)
    .setStyle('SUCCESS')
    .setLabel('Accept');

export const LOCAL_LEADERBOARD_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.LOCAL_LB_USER_MONEY)
  .setStyle('PRIMARY')
  .setEmoji(emoteIds.earth)
  .setLabel('Local');

export const GLOBAL_LEADERBOARD_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.GLOBAL_LB_USER_MONEY)
  .setStyle('PRIMARY')
  .setEmoji(emoteIds.earth)
  .setLabel('Global');

export const createItemButton = (item: Item) =>
  new MessageButton()
    .setCustomId(item.id)
    .setLabel('')
    .setEmoji(item.emojiId)
    .setStyle(item.type === ItemTypes.GIFT ? 'SUCCESS' : 'PRIMARY');

export const createUnboxButton = (user: UserInterface, item: Item, another = false) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.UNBOX}.${item.id}`)
    .setLabel(another ? 'Unbox another Gift' : 'Unbox Gift')
    .setStyle('PRIMARY')
    .setDisabled(!user.has(item));

export const createSellButton = (user: UserInterface, item: Item, text?: string) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.SELL}.${item.id}`)
    .setLabel(text != null ? text : `Sell 1x for ${numberWithCommas(item.price.coins / 2)}`)
    .setEmoji(emoteIds.gold)
    .setStyle('SECONDARY')
    .setDisabled(!user.has(item));

export function createBuyButton(user: UserInterface, item: Item, buyType: BuyType, text?: string) {
  if (buyType === BuyType.COINS) {
    return new MessageButton()
      .setCustomId(`${MessageComponentIds.BUY}.${item.id}.${buyType}`)
      .setLabel(text != null ? text : `Buy 1x for ${numberWithCommas(item.price.coins)}`)
      .setStyle('SUCCESS')
      .setEmoji(emoteIds.gold)
      .setDisabled(!item.buyable.coins || item.price.coins > user.money);
  }

  if (buyType === BuyType.GEMS) {
    return new MessageButton()
      .setCustomId(`${MessageComponentIds.BUY}.${item.id}.${buyType}`)
      .setLabel(text != null ? text : `Buy 1x for ${numberWithCommas(item.price.gems)}`)
      .setStyle('SUCCESS')
      .setEmoji(emoteIds.gem);
  }

  return null;
}

export const createCraftButton = (user: UserInterface, item: Item, recipe) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.CRAFT}.${item.id}`)
    .setLabel(`Craft ${item.name}`)
    .setStyle('SECONDARY')
    .setDisabled(!recipe.requirements.every((itemId) => user.has(Items[itemId])));

export const createJoinRaidButton = (sessionId) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.JOIN_RAID}.${sessionId}`)
    .setLabel(`Join Raid`)
    .setStyle('SUCCESS');

export const createLeaveRaidButton = (sessionId) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.LEAVE_RAID}.${sessionId}`)
    .setLabel(`Leave Raid`)
    .setStyle('SECONDARY');
