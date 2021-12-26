import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import {InventoryType} from './utils/enums.js';
import {BuyableItems, Items} from './items.js';

export const Defaults = {
  MAX_SLOTS: 36,
  STORE_PAGE_SIZE: 5,
  GROUP_COST: 100,
};

export const CommandNames = {
  BUY: 'buy',
  PING: 'ping',
  PROFILE: 'profile',
  RELOAD: 'reload',
  SELL: 'sell',
  SHOP: 'shop',
  ITEM: 'item',
  RAID: 'raid',
  GROUP: 'group',
  SORT: 'sort',
  LEADERBOARD: 'leaderboard',
};

export const GroupSubCommandNames = {
  ADD: 'add',
  REMOVE: 'remove',
  CREATE: 'create',
  DEPOSIT: 'deposit',
  INVITE: 'invite',
};

export const LeaderbordSubCommands = {
  LOCAL: 'local',
  GLOBAL: 'global',
  GROUP: 'group',
  GUILDS: 'guild',
};

export const SortCommandNames = {
  ASCENDING: 'ascending',
  DECENDING: 'decending',
  AGE: 'age',
  RANDOM: 'random',
};

export const UserCommandNames = {
  PROFILE: 'View Profile',
  GROUP: 'View Kingdom',
  RAID: 'Start Raid',
};

export const CommandDescriptions = {
  [CommandNames.BUY]: '🛍️ Buy an item for your inventory',
  [CommandNames.PING]: '🏓 Replies with pong',
  [CommandNames.PROFILE]: "🔎 Return a user's profile",
  [CommandNames.RELOAD]: 'Reload all application commands',
  [CommandNames.SELL]: '🛍️ Sell an item from your inventory',
  [CommandNames.SHOP]: '🛍️ Browse the buyable items',
  [CommandNames.ITEM]: '🔎 Inspect an item',
  [CommandNames.RAID]: '🛡️ Raid another user for their gems',
  [CommandNames.GROUP]: '🌏 Kingdom commands',
  [CommandNames.SORT]: '🧵 Sort your inventory',
  [CommandNames.LEADERBOARD]: '🌏 View the rankings',
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
    {
      name: 'inventory',
      description: "Select which inventory you'd like to inspect",
      type: ApplicationCommandOptionTypes.INTEGER,
      choices: [
        {
          name: 'Main',
          value: InventoryType.Main,
        },
        {
          name: 'Storage',
          value: InventoryType.Storage,
        },
      ],
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
  [CommandNames.RAID]: [
    {
      name: 'gem_wager',
      description: 'The amount of gems will decide the impact of your raid',
      min_value: 1,
      type: ApplicationCommandOptionTypes.NUMBER,
    },
  ],
  [CommandNames.GROUP]: [
    // {
    //   name: GroupSubCommandNames.ADD,
    //   description: '📬 Invite a user to your kingdom',
    //   type: ApplicationCommandOptionTypes.SUB_COMMAND,
    // },
    {
      name: GroupSubCommandNames.INVITE,
      description: '📬 Invite a user to your group',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select the user you wish to invite',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
      ],
    },
    {
      name: GroupSubCommandNames.CREATE,
      description: '🌍 Create a new kingdom',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'name',
          description: 'The name of your kingdom',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
      ],
    },
    {
      name: GroupSubCommandNames.DEPOSIT,
      description: '💰 Deposit gems into your kingdom',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'amount',
          description: 'The amount of gems you wish to deposit',
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          min_value: 1,
        },
      ],
    },
  ],
  [CommandNames.SORT]: [
    {
      name: SortCommandNames.ASCENDING,
      description: '🧵 Sort your inventories by ascending gems per hour',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: SortCommandNames.DECENDING,
      description: '🧵 Sort your inventories by decending gems per hour',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: SortCommandNames.RANDOM,
      description: '🧵 Randomly sort your inventories',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: SortCommandNames.AGE,
      description: '🧵 Sort by the age of each item',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
  [CommandNames.LEADERBOARD]: [
    {
      name: LeaderbordSubCommands.LOCAL,
      description: '🌏 View the local leadboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: LeaderbordSubCommands.GLOBAL,
      description: '🌏 View the global leadboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
};

export const MessageComponentIds = {
  NEXT: 'next',
  LAST: 'last',
  BUY: 'buy',
  SELL: 'sell',
  SHOP: 'shop',
  STORAGE: 'storage',
  PROFILE: 'profile',
  JOIN_RAID: 'join-raid',
  LEAVE_RAID: 'leave-raid',
  ACCEPT_INVITE: 'accept-invite',
  DECLINE_INVITE: 'decline-invite',
  GLOBAL_LB_USER_MONEY: 'global-lb-user-money',
  LOCAL_LB_USER_MONEY: 'local-lb-user-money',
};
