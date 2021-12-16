import moment from 'moment';

export enum ItemTypes {
  GENERATOR,
  TOTEM,
  MISC,
}

interface BaseItem {
  id: string;
  name: string;
  type: ItemTypes;
  emojiId: string;
  price: number;
  buyable: boolean;
}

const month = moment(new Date(), 'YYYY/MM/DD').format('M');

const BaseItems: BaseItem[] = [
  {
    id: 'basic',
    name: 'Basic',
    type: ItemTypes.GENERATOR,
    emojiId: '757396142962245752',
    price: 0.1,
    buyable: true,
  },
  {
    id: 'bronze',
    name: 'Bronze',
    type: ItemTypes.GENERATOR,
    emojiId: '757395337685237771',
    price: 0.2,
    buyable: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    type: ItemTypes.GENERATOR,
    emojiId: '757394237623894118',
    price: 0.3,
    buyable: true,
  },
  {
    name: 'Ruby',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439782453359',
    id: 'ruby',
    price: 0.5,
    buyable: true,
  },
  {
    name: 'Diamond',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439631589486',
    id: 'diamond',
    price: 1,
    buyable: true,
  },
  {
    name: 'Emerald',
    type: ItemTypes.GENERATOR,
    emojiId: '757333439648366642',
    id: 'emerald',
    price: 2,
    buyable: true,
  },
  {
    name: 'Acid',
    type: ItemTypes.GENERATOR,
    emojiId: '761298415149121578',
    id: 'acid',
    price: 3,
    buyable: true,
  },
  {
    name: 'Seaside',
    type: ItemTypes.GENERATOR,
    emojiId: '766695960817827861',
    id: 'seaside',
    price: 5,
    buyable: true,
  },
  {
    name: 'Fade',
    type: ItemTypes.GENERATOR,
    emojiId: '757611084101451846',
    id: 'fade',
    price: 10,
    buyable: true,
  },
  {
    name: 'Moon',
    type: ItemTypes.GENERATOR,
    emojiId: '757615307811586048',
    id: 'moon',
    price: 20,
    buyable: true,
  },
  {
    name: 'Sun',
    type: ItemTypes.GENERATOR,
    emojiId: '757628531264978944',
    id: 'sun',
    price: 30,
    buyable: true,
  },
  {
    name: 'Rainbow',
    type: ItemTypes.GENERATOR,
    emojiId: '761280663017881640',
    id: 'rainbow',
    price: 50,
    buyable: true,
  },
  {
    name: 'Disco',
    type: ItemTypes.GENERATOR,
    emojiId: '761289756692185098',
    id: 'disco',
    price: 100,
    buyable: true,
  },
  {
    name: 'King',
    type: ItemTypes.GENERATOR,
    emojiId: '765942419518521366',
    id: 'king',
    price: 200,
    buyable: true,
  },
  {
    name: 'Mythic',
    type: ItemTypes.GENERATOR,
    emojiId: '775214117719769140',
    id: 'mythic',
    price: 300,
    buyable: true,
  },
  {
    name: 'Pepe',
    type: ItemTypes.GENERATOR,
    emojiId: '772493391082553354',
    id: 'pepe',
    price: 500,
    buyable: false,
  },
  {
    name: 'Pumpkin',
    type: ItemTypes.GENERATOR,
    emojiId: '766678940970123296',
    id: 'pumpkin',
    price: 500,
    buyable: month === '10',
  },
  {
    name: 'Skeleton',
    type: ItemTypes.GENERATOR,
    emojiId: '766680624504635443',
    id: 'skeleton',
    price: 500,
    buyable: month === '10',
  },
  {
    name: 'Present',
    type: ItemTypes.GENERATOR,
    emojiId: '780028217092341780',
    id: 'present',
    price: 500,
    buyable: month === '12',
  },
  {
    name: 'Snowman',
    type: ItemTypes.GENERATOR,
    emojiId: '791567451422851082',
    id: 'snowman',
    price: 500,
    buyable: month === '12',
  },
  {
    name: 'Minecraft',
    type: ItemTypes.GENERATOR,
    emojiId: '797932521999564821',
    id: 'minecraft',
    price: 500,
    buyable: false,
  },
  {
    name: 'Mystic',
    type: ItemTypes.GENERATOR,
    emojiId: '768521388754862110',
    id: 'mystic',
    price: 1000,
    buyable: false,
  },
  {
    name: 'BlueDiamond',
    type: ItemTypes.GENERATOR,
    emojiId: '771335875220602900',
    id: 'bluediamond',
    price: 2000,
    buyable: false,
  },
  {
    name: 'RedDiamond',
    type: ItemTypes.GENERATOR,
    emojiId: '775288572595929099',
    id: 'reddiamond',
    price: 3000,
    buyable: false,
  },
  {
    name: 'Tortoise',
    type: ItemTypes.GENERATOR,
    emojiId: '772311731556843570',
    id: 'tortoise',
    price: 5000,
    buyable: false,
  },
  {
    name: 'Burning',
    type: ItemTypes.GENERATOR,
    emojiId: '779853678021836830',
    id: 'burning',
    price: 10000,
    buyable: false,
  },
  {
    name: 'Scorching',
    type: ItemTypes.GENERATOR,
    emojiId: '779853678295121930',
    id: 'scorching',
    price: 20000,
    buyable: false,
  },
  {
    name: 'RGB',
    type: ItemTypes.GENERATOR,
    emojiId: '778186833557323786',
    id: 'rgb',
    price: 30000,
    buyable: false,
  },
  {
    name: 'Omega',
    type: ItemTypes.GENERATOR,
    emojiId: '802954138702053416',
    id: 'omega',
    price: 50000,
    buyable: false,
  },
];

export interface Item extends BaseItem {
  emoji: string;
  url: string;
}

export const Items: Item[] = BaseItems.map((item: BaseItem) => ({
  ...item,
  emoji: `<a:${item.name}:${item.emojiId}>`,
  url: `https://cdn.discordapp.com/emojis/${item.emojiId}.gif`,
}));

export const BuyableItems = Items.filter((item) => item.buyable);

export function findById(itemId: string): Item {
  return Items.find(({id}) => id === itemId);
}
