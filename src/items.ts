import moment from 'moment';
import {ItemTypes} from './utils/enums.js';

interface BaseItem {
  id: string;
  name: string;
  type: ItemTypes;
  emojiId: string;
  level: number;
  buyable: boolean;
}

const month = moment(new Date(), 'YYYY/MM/DD').format('M');

const BaseItems: BaseItem[] = [
  {
    id: 'basic',
    name: 'Basic',
    type: ItemTypes.GENERATOR,
    emojiId: '757396142962245752',
    level: 1,
    buyable: true,
  },
  {
    id: 'bronze',
    name: 'Bronze',
    type: ItemTypes.GENERATOR,
    emojiId: '757395337685237771',
    level: 2,
    buyable: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    type: ItemTypes.GENERATOR,
    emojiId: '757394237623894118',
    level: 3,
    buyable: true,
  },
  {
    name: 'Ruby',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439782453359',
    id: 'ruby',
    level: 4,
    buyable: true,
  },
  {
    name: 'Diamond',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439631589486',
    id: 'diamond',
    level: 5,
    buyable: true,
  },
  {
    name: 'Emerald',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439648366642',
    id: 'emerald',
    level: 6,
    buyable: true,
  },
  {
    name: 'Acid',
    type: ItemTypes.GENERATOR,
    emojiId: '761298415149121578',
    id: 'acid',
    level: 7,
    buyable: true,
  },
  {
    name: 'Seaside',
    type: ItemTypes.GENERATOR,
    emojiId: '766695960817827861',
    id: 'seaside',
    level: 8,
    buyable: true,
  },
  {
    name: 'Fade',
    type: ItemTypes.GENERATOR,
    emojiId: '757611084101451846',
    id: 'fade',
    level: 9,
    buyable: true,
  },
  {
    name: 'Moon',
    type: ItemTypes.GENERATOR,
    emojiId: '757615307811586048',
    id: 'moon',
    level: 10,
    buyable: true,
  },
  {
    name: 'Sun',
    type: ItemTypes.GENERATOR,
    emojiId: '757628531264978944',
    id: 'sun',
    level: 11,
    buyable: true,
  },
  {
    name: 'Rainbow',
    type: ItemTypes.GENERATOR,
    emojiId: '761280663017881640',
    id: 'rainbow',
    level: 12,
    buyable: true,
  },
  {
    name: 'Disco',
    type: ItemTypes.GENERATOR,
    emojiId: '761289756692185098',
    id: 'disco',
    level: 13,
    buyable: true,
  },
  {
    name: 'King',
    type: ItemTypes.GENERATOR,
    emojiId: '765942419518521366',
    id: 'king',
    level: 14,
    buyable: false,
  },
  {
    name: 'Mythic',
    type: ItemTypes.GENERATOR,
    emojiId: '775214117719769140',
    id: 'mythic',
    level: 15,
    buyable: true,
  },
  {
    name: 'Pepe',
    type: ItemTypes.GENERATOR,
    emojiId: '772493391082553354',
    id: 'pepe',
    level: 15,
    buyable: false,
  },
  {
    name: 'Pumpkin',
    type: ItemTypes.GENERATOR,
    emojiId: '766678940970123296',
    id: 'pumpkin',
    level: 15,
    buyable: month === '10',
  },
  {
    name: 'Skeleton',
    type: ItemTypes.GENERATOR,
    emojiId: '766680624504635443',
    id: 'skeleton',
    level: 15,
    buyable: month === '10',
  },
  {
    name: 'Present',
    type: ItemTypes.GENERATOR,
    emojiId: '780028217092341780',
    id: 'present',
    level: 15,
    buyable: month === '12',
  },
  {
    name: 'Snowman',
    type: ItemTypes.GENERATOR,
    emojiId: '791567451422851082',
    id: 'snowman',
    level: 15,
    buyable: month === '12',
  },
  {
    name: 'Minecraft',
    type: ItemTypes.GENERATOR,
    emojiId: '797932521999564821',
    id: 'minecraft',
    level: 15,
    buyable: true,
  },
  {
    name: 'Mystic',
    type: ItemTypes.GENERATOR,
    emojiId: '768521388754862110',
    id: 'mystic',
    level: 16,
    buyable: false,
  },
  {
    name: 'BlueDiamond',
    type: ItemTypes.GENERATOR,
    emojiId: '771335875220602900',
    id: 'bluediamond',
    level: 17,
    buyable: false,
  },
  {
    name: 'RedDiamond',
    type: ItemTypes.GENERATOR,
    emojiId: '775288572595929099',
    id: 'reddiamond',
    level: 18,
    buyable: true,
  },
  {
    name: 'Tortoise',
    type: ItemTypes.GENERATOR,
    emojiId: '772311731556843570',
    id: 'tortoise',
    level: 19,
    buyable: false,
  },
  {
    name: 'Burning',
    type: ItemTypes.GENERATOR,
    emojiId: '779853678021836830',
    id: 'burning',
    level: 20,
    buyable: true,
  },
  {
    name: 'Scorching',
    type: ItemTypes.GENERATOR,
    emojiId: '779853678295121930',
    id: 'scorching',
    level: 21,
    buyable: true,
  },
  {
    name: 'RGB',
    type: ItemTypes.GENERATOR,
    emojiId: '778186833557323786',
    id: 'rgb',
    level: 22,
    buyable: false,
  },
  {
    name: 'Omega',
    type: ItemTypes.GENERATOR,
    emojiId: '802954138702053416',
    id: 'omega',
    level: 23,
    buyable: false,
  },
];

export interface Item extends BaseItem {
  emoji: string;
  url: string;
  price: number;
  gph: number;
}

export const Items: Item[] = BaseItems.map((item: BaseItem) => ({
  ...item,
  gph: item.level / 2,
  price: item.level ** 3,
  emoji: `<a:${item.id}:${item.emojiId}>`,
  url: `https://cdn.discordapp.com/emojis/${item.emojiId}.gif`,
}));

export const BuyableItems = Items.filter((item) => item.buyable);

export function findById(itemId: string): Item {
  return Items.find(({id}) => id === itemId);
}
