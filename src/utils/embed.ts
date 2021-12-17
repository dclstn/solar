import {UserInterface} from 'database/user';
import {MessageEmbed} from 'discord.js';
import chunk from 'lodash.chunk';
import {Defaults} from '../constants.js';
import emotes from './emotes.js';

function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const createProfileDescription = (user: UserInterface, grid: string) => `

💰 Gold: **${numberWithCommas(user.gold)}**
${emotes.gem} Gems: **${numberWithCommas(user.gems)}**

${grid}
`;

export function success(user: UserInterface, content: string): MessageEmbed {
  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setColor('GREEN')
    .setDescription(`${emotes.success} ${content}`);
}

export function warning(user: UserInterface, content: string): MessageEmbed {
  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setColor('RED')
    .setDescription(`${emotes.error} ${content}`);
}

export function profileEmbed(user: UserInterface): MessageEmbed {
  const items = user.fetchInventory();
  const emojis = items.map((item) => item.emoji);

  const grid = chunk([...emojis, ...new Array(Defaults.MAX_SLOTS - emojis.length).fill(emotes.blank)], 6);
  const gridString = grid.map((row: Array<string>) => row.join(' ')).join('\n');

  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setDescription(createProfileDescription(user, gridString))
    .setColor('BLURPLE')
    .setTimestamp(new Date());
}
