import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import isProd from './utils/enviroment.js';
import {InventoryType} from './utils/enums.js';
import {BUYABLE_ITEMS} from './utils/items.js';
import {RECIPES} from './utils/recipes.js';
import {capitalizeFirstLetter} from './utils/index.js';

export const LeaderboardType = {
  GPH: 'gph',
  MONEY: 'money',
};

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
  WORKBENCH: 'workbench',
  VOTE: 'vote',
  PVP: 'pvp',
};

export const AdminSubCommandNames = {
  RELOAD: 'reload',
  GIVE: 'give',
};

export const WorkBenchSubCommandNames = {
  CRAFT: 'craft',
  RECIPES: 'recipes',
  HOME: 'home',
};

export const GameSubCommandNames = {
  SPIN: 'spin',
  SLOTS: 'slots',
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
  [CommandNames.RAID]: '🔫 Fight another user',
  [CommandNames.GROUP]: '🌏 Group commands',
  [CommandNames.SORT]: '🧵 Sort your inventory',
  [CommandNames.LEADERBOARD]: '🌏 View the rankings',
  [CommandNames.GAMES]: '🎮 Play a game',
  [CommandNames.ADMIN]: '🖥️ Admin-only commands',
  [CommandNames.MOVE]: '📪 Move an item',
  [CommandNames.WORKBENCH]: '🛠️ Your workbench',
  [CommandNames.VOTE]: '📩 Show your vote progress',
  [CommandNames.PVP]: '🔫 Enable/disable pvp mode',
};

export const CommandOptions = {
  [CommandNames.VOTE]: [
    {
      name: 'user',
      description: "Inspect a selected user's votes",
      type: ApplicationCommandOptionTypes.USER,
    },
  ],
  [CommandNames.PVP]: [
    {
      name: 'enable',
      description: 'Enable PVP mode for yourself',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      required: true,
    },
  ],
  [CommandNames.BUY]: [
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
  [CommandNames.WORKBENCH]: [
    {
      name: WorkBenchSubCommandNames.HOME,
      description: '🔨 Show your current workbench status',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: WorkBenchSubCommandNames.RECIPES,
      description: '📎 Show all the available recipes',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: WorkBenchSubCommandNames.CRAFT,
      description: '🛠️ Craft an item',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'recipe',
          description: 'Select the recipe you wish to craft',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: Object.keys(RECIPES).map((recipe) => ({
            name: capitalizeFirstLetter(recipe),
            value: recipe,
          })),
        },
      ],
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
      autocomplete: true,
    },
  ],
  [CommandNames.RAID]: [
    {
      name: 'user',
      description: 'Select a user to raid',
      type: ApplicationCommandOptionTypes.USER,
      required: true,
    },
  ],
  [CommandNames.MOVE]: [
    {
      name: 'item',
      description: 'Select an item to move',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
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
      description: '💰 Deposit coins into your group',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'amount',
          description: 'The amount of coins you wish to deposit',
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
      description: '🧵 Sort your inventories by ascending coins per hour',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: SortCommandNames.DESCENDING,
      description: '🧵 Sort your inventories by decending coins per hour',
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
      options: [
        {
          name: 'type',
          description: 'Sort by field',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: 'Coins Per Hour',
              value: LeaderboardType.GPH,
            },
            {
              name: 'Coins',
              value: LeaderboardType.MONEY,
            },
          ],
        },
      ],
    },
    {
      name: LeaderbordSubCommands.GLOBAL,
      description: '🌏 View the global leadboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'type',
          description: 'Sort by field',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: 'Coins Per Hour',
              value: LeaderboardType.GPH,
            },
            {
              name: 'Coins',
              value: LeaderboardType.MONEY,
            },
          ],
        },
      ],
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
      name: GameSubCommandNames.SLOTS,
      description: 'Play a game of slots!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'wager',
          description: 'How many coins do you wish to wager?',
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: GameSubCommandNames.SPIN,
      description: 'Spin the wheel for a prize!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
};

export const MessageComponentIds = {
  NEXT: 'next',
  LAST: 'last',
  BUY: 'buy',
  SELL: 'sell',
  CRAFT: 'craft',
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
  VALIDATE_VOTES: 'validate-votes',
  TOGGLE_NOTIFICATION: 'toggle-notification',
};

export const PaymentIds = {
  BUTTLOAD_OF_GEMS: 'price_1KcGZ4BLF5bK8rcnjZ8xOsgS',
  CHEST_FULL_OF_GEMS: 'price_1KcGYzBLF5bK8rcnkXXs4TGQ',
  BAG_OF_GEMS: 'price_1KcGYdBLF5bK8rcnNKYm7dUc',
  HANDFUL_OF_GEMS: 'price_1KcGQuBLF5bK8rcn6tMxpL3l',
  TEST_BUTTLOAD_OF_GEMS: 'price_1Kc2oqBLF5bK8rcnUrhi81VB',
};

export const ENDPOINT = isProd() ? 'https://castlemania.bot' : 'http://localhost:3000';
