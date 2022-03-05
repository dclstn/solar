import {MessageButton} from 'discord.js';
import {Item} from './items.js';
import {MessageComponentIds} from '../constants.js';
import {emoteIds} from './emotes.js';
import {ItemTypes} from './enums.js';
import type {UserInterface} from '../types/user.js';
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

export const createSellButton = (user: UserInterface, item: Item) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.SELL}.${item.id}`)
    .setLabel(`Sell for ${numberWithCommas(item.price / 2)}`)
    .setEmoji(emoteIds.gem)
    .setStyle('DANGER')
    .setDisabled(!user.has(item));

export const createBuyButton = (user: UserInterface, item: Item) =>
  new MessageButton()
    .setCustomId(`${MessageComponentIds.BUY}.${item.id}`)
    .setLabel(`Buy for ${numberWithCommas(item.price)}`)
    .setStyle('SUCCESS')
    .setEmoji(emoteIds.gem)
    .setDisabled(!item.buyable || item.price > user.money);
