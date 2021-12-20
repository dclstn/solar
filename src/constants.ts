import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import {BuyableItems, Items} from './items.js';

export const Defaults = {
  MAX_SLOTS: 36,
  STORE_PAGE_SIZE: 5,
};

export const CommandNames = {
  BUY: 'buy',
  PING: 'ping',
  PROFILE: 'profile',
  RELOAD: 'reload',
  SELL: 'sell',
  SHOP: 'shop',
  ITEM: 'item',
};

export const UserCommandNames = {
  PROFILE: 'View Profile',
};

export const CommandDescriptions = {
  [CommandNames.BUY]: '🛍️ Buy an item for your inventory',
  [CommandNames.PING]: '🏓 Replies with pong',
  [CommandNames.PROFILE]: "🔎 Return a user's profile",
  [CommandNames.RELOAD]: 'Reload all application commands',
  [CommandNames.SELL]: '🛍️ Sell an item from your inventory',
  [CommandNames.SHOP]: '🛍️ Browse the buyable items',
  [CommandNames.ITEM]: '🔎 Inspect an item',
};

export const CommandOptions = {
  [CommandNames.BUY]: [
    {
      name: 'item',
      description: 'Select the item you wish to buy',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: BuyableItems.map(({id, name}) => ({name, value: id})),
    },
    {
      name: 'amount',
      description: 'How many?',
      min_value: 1,
      type: ApplicationCommandOptionTypes.NUMBER,
    },
  ],
  [CommandNames.PROFILE]: [
    {
      name: 'user',
      description: "Inspect a selected user's profile",
      type: ApplicationCommandOptionTypes.USER,
    },
  ],
  [CommandNames.SELL]: [
    {
      name: 'item',
      description: 'Select the item you wish to buy',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: 'amount',
      description: 'How many?',
      min_value: 1,
      type: ApplicationCommandOptionTypes.NUMBER,
    },
  ],
  [CommandNames.SHOP]: [
    {
      name: 'page',
      description: 'Select the page you wish to view',
      type: ApplicationCommandOptionTypes.INTEGER,
      min_value: 1,
      max_value: Math.floor(BuyableItems.length / Defaults.STORE_PAGE_SIZE) + 1,
    },
  ],
  [CommandNames.ITEM]: [
    {
      name: 'item',
      description: 'Select an item to inspect',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: Items.slice(0, 25).map(({id, name}) => ({name, value: id})),
    },
  ],
};

export const MessageComponentIds = {
  NEXT: 'next',
  LAST: 'last',
  BUY: 'buy',
  SELL: 'sell',
};
