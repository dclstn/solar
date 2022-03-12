import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import isProd from './utils/enviroment.js';
import {InventoryType} from './utils/enums.js';
import {BUYABLE_ITEMS, Items} from './utils/items.js';

export const Defaults = {
  MAX_SLOTS: 36,
  STORE_PAGE_SIZE: 5,
  GROUP_COST: 100,
};

export const CommandNames = {
  BUY: 'buy',
  PING: 'ping',
  PROFILE: 'profile',
  SELL: 'sell',
  SHOP: 'shop',
  ITEM: 'item',
  RAID: 'raid',
  GROUP: 'group',
  SORT: 'sort',
  LEADERBOARD: 'leaderboard',
  GAMES: 'games',
  ADMIN: 'admin',
  MOVE: 'move',
  STORAGE: 'storage',
};

export const AdminSubCommandNames = {
  RELOAD: 'reload',
  GIVE: 'give',
  MIGRATE: 'migrate',
};

export const GameSubCommandNames = {
  ROLL: 'roll',
  SPIN: 'spin',
};

export const GroupSubCommandNames = {
  ADD: 'add',
  REMOVE: 'remove',
  CREATE: 'create',
  DEPOSIT: 'deposit',
  INVITE: 'invite',
  KICK: 'kick',
  HOME: 'home',
};

export const LeaderbordSubCommands = {
  LOCAL: 'local',
  GLOBAL: 'global',
  GROUP: 'group',
  GUILDS: 'guild',
};

export const SortCommandNames = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  AGE: 'age',
  RANDOM: 'random',
};

export const UserCommandNames = {
  PROFILE: 'View Profile',
  STORAGE: 'View Storage',
  GROUP: 'View Group',
  RAID: 'Start Raid',
};

export const CommandDescriptions = {
  [CommandNames.BUY]: '🛍️ Buy an item for your inventory',
  [CommandNames.PING]: '🏓 Replies with pong',
  [CommandNames.PROFILE]: "🔎 Return a user's profile",
  [CommandNames.STORAGE]: "🔎 Return a user's storage",
  [CommandNames.SELL]: '🛍️ Sell an item from your inventory',
  [CommandNames.SHOP]: '🛍️ Browse the buyable items',
  [CommandNames.ITEM]: '🔎 Inspect an item',
  [CommandNames.RAID]: '🛡️ Raid another user for their gems',
  [CommandNames.GROUP]: '🌏 Group commands',
  [CommandNames.SORT]: '🧵 Sort your inventory',
  [CommandNames.LEADERBOARD]: '🌏 View the rankings',
  [CommandNames.GAMES]: '🎮 Play a game',
  [CommandNames.ADMIN]: '🖥️ Admin-only commands',
  [CommandNames.MOVE]: '📪 Move an item',
};

export const CommandOptions = {
  [CommandNames.BUY]: [
    {
      name: 'item',
      description: 'Select the item you wish to buy',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
      // choices: BUYABLE_ITEMS.map(({id, name}) => ({name, value: id})),
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
  [CommandNames.STORAGE]: [
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
      autocomplete: true,
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
      max_value: Math.floor(BUYABLE_ITEMS.length / Defaults.STORE_PAGE_SIZE) + 1,
    },
  ],
  [CommandNames.ITEM]: [
    {
      name: 'item',
      description: 'Select an item to inspect',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: Object.values(Items)
        .slice(0, 25)
        .map(({id, name}) => ({name, value: id})),
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
  [CommandNames.MOVE]: [
    {
      name: 'item',
      description: 'Select an item to move',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: Object.values(Items)
        .slice(0, 25)
        .map(({id, name}) => ({name, value: id})),
    },
    {
      name: 'from',
      description: "Select which inventory you'd like to move from",
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
      required: true,
    },
    {
      name: 'to',
      description: "Select which inventory you'd like to move to",
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
      required: true,
    },
    {
      name: 'amount',
      description: 'How many?',
      min_value: 1,
      type: ApplicationCommandOptionTypes.INTEGER,
      required: false,
    },
  ],
  [CommandNames.GROUP]: [
    {
      name: GroupSubCommandNames.HOME,
      description: '🌎 View group',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
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
      name: GroupSubCommandNames.KICK,
      description: '🏈 Kick a user from the group',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select the user you wish to kick',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
      ],
    },
    {
      name: GroupSubCommandNames.CREATE,
      description: '🌍 Create a new group',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'name',
          description: 'The name of your group',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
      ],
    },
    {
      name: GroupSubCommandNames.DEPOSIT,
      description: '💰 Deposit gems into your group',
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
      name: SortCommandNames.DESCENDING,
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
  [CommandNames.ADMIN]: [
    {
      name: AdminSubCommandNames.RELOAD,
      description: 'Reload application commands',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'global',
          description: 'Set global application commands',
          type: ApplicationCommandOptionTypes.BOOLEAN,
          required: true,
        },
      ],
    },
    {
      name: AdminSubCommandNames.MIGRATE,
      description: 'Migrate the old db',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: AdminSubCommandNames.GIVE,
      description: 'Give a user an item',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select a user to give to',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'item',
          description: 'Select an item to give',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          autocomplete: true,
        },
        {
          name: 'amount',
          description: 'How many?',
          min_value: 1,
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
      ],
    },
  ],
  [CommandNames.GAMES]: [
    {
      name: GameSubCommandNames.SPIN,
      description: '🤞 Spin the wheel',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: GameSubCommandNames.ROLL,
      description: '🤞 Roll a dice',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'wager',
          description: 'How many gems do you wish to wager?',
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          min_value: 1,
        },
        {
          name: 'side',
          description: 'Choose the side of die',
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          choices: [
            {
              name: 'One',
              value: 1,
            },
            {
              name: 'Two',
              value: 2,
            },
            {
              name: 'Three',
              value: 3,
            },
            {
              name: 'Four',
              value: 4,
            },
            {
              name: 'Five',
              value: 5,
            },
            {
              name: 'Six',
              value: 6,
            },
          ],
        },
      ],
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
  UNBOX: 'unbox',
};

export const PaymentIds = {
  BUTTLOAD_OF_GEMS: 'price_1KcGZ4BLF5bK8rcnjZ8xOsgS',
  CHEST_FULL_OF_GEMS: 'price_1KcGYzBLF5bK8rcnkXXs4TGQ',
  BAG_OF_GEMS: 'price_1KcGYdBLF5bK8rcnNKYm7dUc',
  HANDFUL_OF_GEMS: 'price_1KcGQuBLF5bK8rcn6tMxpL3l',
  TEST_BUTTLOAD_OF_GEMS: 'price_1Kc2oqBLF5bK8rcnUrhi81VB',
};

export const ENDPOINT = isProd() ? 'https://castlemania.bot' : 'http://localhost:3000';
