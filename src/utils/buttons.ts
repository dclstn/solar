import {MessageButton} from 'discord.js';
import {Item} from '../items.js';
import {MessageComponentIds} from '../constants.js';
import {emoteIds} from './emotes.js';
import {ItemTypes} from './enums.js';
import type {UserInterface} from '../types/user.js';

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
  .setStyle('SUCCESS')
  .setLabel('Shop')
  .setEmoji(emoteIds.shopping);

export const ACCEPT_INVITE_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.ACCEPT_INVITE)
  .setStyle('SUCCESS')
  .setLabel('Accept');

export const DECLINE_INVITE_BUTTON = new MessageButton()
  .setCustomId(MessageComponentIds.DECLINE_INVITE)
  .setStyle('DANGER')
  .setLabel('Decline');

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
    .setStyle('PRIMARY')
    .setEmoji(item.emojiId)
    .setDisabled(!user.has(item));
