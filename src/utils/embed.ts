import {UserInterface} from 'database/user';
import {MessageEmbed} from 'discord.js';
import chunk from 'lodash.chunk';
import {findById} from '../items.js';
import {Defaults} from '../constants.js';
import {emoteStrings} from './emotes.js';

export function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const createProfileDescription = (user: UserInterface, grid: string) => `

${emoteStrings.gem} Gems: **${numberWithCommas(user.money)}**
💰 Gems Per Hour: **${numberWithCommas(user.inventory.gph())}**

${grid}
`;

export function success(user: UserInterface, content: string): MessageEmbed {
  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setColor('GREEN')
    .setDescription(`${emoteStrings.success} ${content}`);
}

export function warning(user: UserInterface, content: string): MessageEmbed {
  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setColor('RED')
    .setDescription(`${emoteStrings.error} ${content}`);
}

export function profileEmbed(user: UserInterface): MessageEmbed {
  const grid = chunk(new Array(Defaults.MAX_SLOTS).fill(emoteStrings.blank), Math.sqrt(Defaults.MAX_SLOTS));

  user.inventory.items.forEach(({cords, id}) => {
    grid[cords.y][cords.x] = findById(id).emoji;
  });

  const gridString = grid.map((row: Array<string>) => row.join(' ')).join('\n');

  return new MessageEmbed()
    .setAuthor(user.username, user.avatar)
    .setDescription(createProfileDescription(user, gridString))
    .setColor('BLURPLE')
    .setTimestamp(new Date());
}
