import {MessageButton} from 'discord.js';
import {Item, Items} from './items.js';
import {MessageComponentIds} from '../constants.js';
import {emoteIds} from './emotes.js';
import {ItemTypes} from './enums.js';
import type {UserInterface} from '../types/user.js';
import {numberWithCommas} from './embed.js';
import type {GroupInterface} from '../types/group.js';
import client from '../client.js';

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
  .setURL(`https://top.gg/bot/${client.user.id}/vote`)
  .setLabel('Vote Top.GG');

export const VOTE_DBL = new MessageButton()
  .setStyle('LINK')
  .setURL('https://discordbotlist.com/bots/castle-mania/upvote')
  .setLabel('Vote DiscordBotList.com');

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
    .setLabel(another ? 'Unwrap another' : 'Unwrap')
    .setStyle('SUCCESS')
    .setEmoji(item.emojiId)
    .setDisabled(!user.has(item));

export const createSellButton = (user: UserInterface, item: Item, text?: string) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.SELL}.${item.id}`)
    .setLabel(text != null ? text : `Sell for ${numberWithCommas(item.price / 2)}`)
    .setEmoji(emoteIds.gem)
    .setStyle('DANGER')
    .setDisabled(!user.has(item));

export const createBuyButton = (user: UserInterface, item: Item, text?: string) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.BUY}.${item.id}`)
    .setLabel(text != null ? text : `Buy for ${numberWithCommas(item.price)}`)
    .setStyle('SUCCESS')
    .setEmoji(emoteIds.gem)
    .setDisabled(!item.buyable || item.price > user.money);

export const createCraftButton = (user: UserInterface, item: Item, recipe) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.CRAFT}.${item.id}`)
    .setLabel(`Craft ${item.name}`)
    .setStyle('PRIMARY')
    .setDisabled(!recipe.requirements.every((itemId) => user.has(Items[itemId])));
