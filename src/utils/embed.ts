import {MessageEmbed} from 'discord.js';
import type {UserInterface} from '../types/user.js';
import {emoteStrings} from './emotes.js';

export function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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
