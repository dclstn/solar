import moment from 'moment';
import Fuse from 'fuse.js';
import {ItemTypes} from './enums.js';

const month = moment(new Date(), 'YYYY/MM/DD').format('M');

export enum ItemIds {
  BASIC = 'basic',
  BRONZE = 'bronze',
  GOLD = 'gold',
  RUBY = 'ruby',
  DIAMOND = 'diamond',
  EMERALD = 'emerald',
  ACID = 'acid',
  SEASIDE = 'seaside',
  FADE = 'fade',
  MOON = 'moon',
  SUN = 'sun',
  RAINBOW = 'rainbow',
  DISCO = 'disco',
  KING = 'king',
  MYTHIC = 'mythic',
  PEPE = 'pepe',
  PUMPKIN = 'pumpkin',
  SKELETON = 'skeleton',
  PRESENT = 'present',
  SNOWMAN = 'snowman',
  MINECRAFT = 'minecraft',
  MYSTIC = 'mystic',
  BLUE_DIAMOND = 'bluediamond',
  RED_DIAMOND = 'reddiamond',
  TORTOISE = 'tortoise',
  BURNING = 'burning',
  SCORCHING = 'scorching',
  AZURE = 'azure',
  RGB = 'rgb',
  OMEGA = 'omega',
  GIFT = 'gift',
}

export enum ItemRarities {
  COMMON,
  UNCOMMON,
  EPIC,
  LEGENDARY,
}

interface BaseItem {
  id: ItemIds;
  name: string;
  type: ItemTypes;
  emojiId: string;
  level: number;
  buyable: boolean;
  rarity: ItemRarities;
  animated?: boolean;
}

const BaseItems = {
  [ItemIds.BASIC]: {
    id: ItemIds.BASIC,
    name: 'Basic',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.COMMON,
    emojiId: '757396142962245752',
    level: 1,
    buyable: true,
    animated: true,
  },
  [ItemIds.BRONZE]: {
    id: ItemIds.BRONZE,
    name: 'Bronze',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.COMMON,
    emojiId: '757395337685237771',
    level: 2,
    buyable: true,
    animated: true,
  },
  [ItemIds.GOLD]: {
    id: ItemIds.GOLD,
    name: 'Gold',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.COMMON,
    emojiId: '757394237623894118',
    level: 3,
    buyable: true,
    animated: true,
  },
  [ItemIds.RUBY]: {
    name: 'Ruby',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.UNCOMMON,
    emojiId: '757333439782453359',
    id: ItemIds.RUBY,
    level: 4,
    buyable: true,
    animated: true,
  },
  [ItemIds.DIAMOND]: {
    name: 'Diamond',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.UNCOMMON,
    emojiId: '757333439631589486',
    id: ItemIds.DIAMOND,
    level: 5,
    buyable: true,
    animated: true,
  },
  [ItemIds.EMERALD]: {
    name: 'Emerald',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.UNCOMMON,
    emojiId: '757333439648366642',
    id: ItemIds.EMERALD,
    level: 6,
    buyable: true,
    animated: true,
  },
  [ItemIds.ACID]: {
    name: 'Acid',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.UNCOMMON,
    emojiId: '761298415149121578',
    id: ItemIds.ACID,
    level: 7,
    buyable: true,
    animated: true,
  },
  [ItemIds.SEASIDE]: {
    name: 'Seaside',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.UNCOMMON,
    emojiId: '766695960817827861',
    id: ItemIds.SEASIDE,
    level: 8,
    buyable: true,
    animated: true,
  },
  [ItemIds.FADE]: {
    name: 'Fade',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '757611084101451846',
    id: ItemIds.FADE,
    level: 9,
    buyable: true,
    animated: true,
  },
  [ItemIds.MOON]: {
    name: 'Moon',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '757615307811586048',
    id: ItemIds.MOON,
    level: 10,
    buyable: true,
    animated: true,
  },
  [ItemIds.SUN]: {
    name: 'Sun',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '757628531264978944',
    id: ItemIds.SUN,
    level: 11,
    buyable: true,
    animated: true,
  },
  [ItemIds.RAINBOW]: {
    name: 'Rainbow',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '761280663017881640',
    id: ItemIds.RAINBOW,
    level: 12,
    buyable: true,
    animated: true,
  },
  [ItemIds.DISCO]: {
    name: 'Disco',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '761289756692185098',
    id: ItemIds.DISCO,
    level: 13,
    buyable: true,
    animated: true,
  },
  [ItemIds.KING]: {
    name: 'King',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '765942419518521366',
    id: ItemIds.KING,
    level: 14,
    buyable: false,
    animated: true,
  },
  [ItemIds.MYTHIC]: {
    name: 'Mythic',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '775214117719769140',
    id: ItemIds.MYTHIC,
    level: 15,
    buyable: true,
    animated: true,
  },
  [ItemIds.PEPE]: {
    name: 'Pepe',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '772493391082553354',
    id: ItemIds.PEPE,
    level: 15,
    buyable: false,
    animated: true,
  },
  [ItemIds.PUMPKIN]: {
    name: 'Pumpkin',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '766678940970123296',
    id: ItemIds.PUMPKIN,
    level: 15,
    buyable: month === '10',
    animated: true,
  },
  [ItemIds.SKELETON]: {
    name: 'Skeleton',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '766680624504635443',
    id: ItemIds.SKELETON,
    level: 15,
    buyable: month === '10',
    animated: true,
  },
  [ItemIds.PRESENT]: {
    name: 'Present',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '780028217092341780',
    id: ItemIds.PRESENT,
    level: 15,
    buyable: month === '12',
    animated: true,
  },
  [ItemIds.SNOWMAN]: {
    name: 'Snowman',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '791567451422851082',
    id: ItemIds.SNOWMAN,
    level: 15,
    buyable: month === '12',
    animated: true,
  },
  [ItemIds.MINECRAFT]: {
    name: 'Minecraft',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.EPIC,
    emojiId: '797932521999564821',
    id: ItemIds.MINECRAFT,
    level: 15,
    buyable: true,
    animated: true,
  },
  [ItemIds.MYSTIC]: {
    name: 'Mystic',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '768521388754862110',
    id: ItemIds.MYSTIC,
    level: 16,
    buyable: false,
    animated: true,
  },
  [ItemIds.BLUE_DIAMOND]: {
    name: 'BlueDiamond',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '771335875220602900',
    id: ItemIds.BLUE_DIAMOND,
    level: 17,
    buyable: false,
    animated: true,
  },
  [ItemIds.RED_DIAMOND]: {
    name: 'RedDiamond',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '775288572595929099',
    id: ItemIds.RED_DIAMOND,
    level: 18,
    buyable: false,
    animated: true,
  },
  [ItemIds.TORTOISE]: {
    name: 'Tortoise',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '772311731556843570',
    id: ItemIds.TORTOISE,
    level: 19,
    buyable: false,
    animated: true,
  },
  [ItemIds.BURNING]: {
    name: 'Burning',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '779853678021836830',
    id: ItemIds.BURNING,
    level: 20,
    buyable: false,
    animated: true,
  },
  [ItemIds.SCORCHING]: {
    name: 'Scorching',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '779853678295121930',
    id: ItemIds.SCORCHING,
    level: 21,
    buyable: false,
    animated: true,
  },
  [ItemIds.AZURE]: {
    name: 'Azure',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '798744705608187924',
    id: ItemIds.AZURE,
    level: 22,
    buyable: false,
    animated: true,
  },
  [ItemIds.RGB]: {
    name: 'RGB',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '778186833557323786',
    id: ItemIds.RGB,
    level: 23,
    buyable: false,
    animated: true,
  },
  [ItemIds.OMEGA]: {
    name: 'Omega',
    type: ItemTypes.GENERATOR,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '802954138702053416',
    id: ItemIds.OMEGA,
    level: 24,
    buyable: false,
    animated: true,
  },
  [ItemIds.GIFT]: {
    name: 'Gift',
    type: ItemTypes.GIFT,
    rarity: ItemRarities.LEGENDARY,
    emojiId: '851512656019324938',
    id: ItemIds.GIFT,
    level: 0,
    buyable: false,
    animated: false,
  },
};

export const Chances = {
  [ItemRarities.COMMON]: 1,
  [ItemRarities.UNCOMMON]: 0.4,
  [ItemRarities.EPIC]: 0.05,
  [ItemRarities.LEGENDARY]: 0.01,
};

export const RarityColours = {
  [ItemRarities.COMMON]: 'BLURPLE',
  [ItemRarities.UNCOMMON]: 'DARK_GREEN',
  [ItemRarities.EPIC]: 'PURPLE',
  [ItemRarities.LEGENDARY]: 'GOLD',
};

export interface Item extends BaseItem {
  emoji: string;
  url: string;
  price?: number;
  gph?: number;
}

export const Items = Object.fromEntries(
  Object.entries(BaseItems).map(([key, item]) => [
    key,
    {
      ...item,
      gph: item.level / 2,
      price: item.level ** 3,
      emoji: item.animated ? `<a:${item.id}:${item.emojiId}>` : `<:${item.id}:${item.emojiId}>`,
      url: `https://cdn.discordapp.com/emojis/${item.emojiId}.${item.animated ? 'gif' : 'png'}`,
    },
  ])
);

export const BUYABLE_ITEMS = Object.values(Items).filter((item) => item.buyable);

export const DEFAULT_BUYABLE_ITEMS = BUYABLE_ITEMS.slice(0, 24);
export const DEFAULT_ITEMS = Object.values(Items).slice(0, 24);

export function findById(itemId: string): Item {
  return Items[itemId];
}

export const fuzzy = new Fuse(Object.values(Items), {
  shouldSort: true,
  keys: ['name', 'type'],
});

export function handleItemAutocomplete(interaction) {
  const search = interaction.options.getString('item');

  const results =
    search.length === 0
      ? DEFAULT_ITEMS.map((item) => ({
          name: item.name,
          value: item.id,
        }))
      : fuzzy
          .search(search)
          .splice(0, 24)
          .map((result) => ({
            name: result.item.name,
            value: result.item.id,
          }));

  interaction.respond(results);
}
