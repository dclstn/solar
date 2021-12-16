import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import {BuyableItems} from './items.js';

export const Defaults = {
  MAX_SLOTS: 25,
};

export const CommandNames = {
  BUY: 'buy',
  PING: 'ping',
  PROFILE: 'profile',
  RELOAD: 'reload',
  SELL: 'sell',
};

export const UserCommandNames = {
  PROFILE: 'Inspect',
};

export const CommandDescriptions = {
  [CommandNames.BUY]: '🛍️ Buy an item for your inventory',
  [CommandNames.PING]: '🏓 Replies with pong',
  [CommandNames.PROFILE]: "🔎 Return a user's profile.",
  [CommandNames.RELOAD]: 'Reload all application commands',
  [CommandNames.SELL]: '🛍️ Sell an item from your inventory',
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
};
