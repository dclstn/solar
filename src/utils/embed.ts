import {MessageEmbed} from 'discord.js';
import table from 'text-table';
import client from '../client.js';
import {Item} from '../items.js';
import {emoteStrings} from './emotes.js';

export function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const purchaseDescription = (item: Item, amount: number) => `
${item.emoji} **${item.name}** x${amount}

- ${emoteStrings.gem} **${numberWithCommas(amount * item.price)}**
`;

const saleDescription = (item: Item, amount: number) => `
${item.emoji} **${item.name}** x${amount}

+ ${emoteStrings.gem} **${numberWithCommas((amount * item.price) / 2)}**
`;

export function success(content: string): MessageEmbed {
  return new MessageEmbed().setColor('GREEN').setDescription(`${emoteStrings.success} ${content}`);
}

export function warning(content: string): MessageEmbed {
  return new MessageEmbed().setColor('RED').setDescription(`${emoteStrings.error} ${content}`);
}

export function purchase(item: Item, amount: number): MessageEmbed {
  return new MessageEmbed()
    .setAuthor('Your Reciept', client.user.avatarURL())
    .setColor('GREEN')
    .setDescription(purchaseDescription(item, amount))
    .setFooter('Thank you for your purchase!')
    .setTimestamp(new Date());
}

export function sale(item: Item, amount: number): MessageEmbed {
  return new MessageEmbed()
    .setAuthor('Your Reciept', client.user.avatarURL())
    .setColor('GREEN')
    .setDescription(saleDescription(item, amount))
    .setFooter('Thank you for your sale!')
    .setTimestamp(new Date());
}

export function createLeaderboardEmbed(headers: string[], values: string[][]): MessageEmbed {
  return new MessageEmbed()
    .setDescription(`\`\`\`md\n${table([headers, ...values])}\`\`\``)
    .setColor('GOLD')
    .setTimestamp(new Date());
}
