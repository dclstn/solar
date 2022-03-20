import {MessageEmbed} from 'discord.js';
import table from 'text-table';
import {Item} from './items.js';
import {emoteStrings} from './emotes.js';

export function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function success(content: string): MessageEmbed {
  return new MessageEmbed().setColor('GREEN').setDescription(`${emoteStrings.success} ${content}`);
}

export function warning(content: string): MessageEmbed {
  return new MessageEmbed().setColor('RED').setDescription(`${emoteStrings.error} ${content}`);
}

export function purchase(item: Item, amount: number): MessageEmbed {
  return new MessageEmbed()
    .setColor('GREEN')
    .addField('Purchase', `${item.emoji} **${item.name}** x${amount}`, true)
    .addField('Cost', `- ${emoteStrings.gem} **${numberWithCommas(amount * item.price)}**`, true)
    .setFooter({text: 'Thank you for your purchase!'})
    .setTimestamp(new Date());
}

export function sale(item: Item, amount: number): MessageEmbed {
  return new MessageEmbed()
    .setColor('RED')
    .addField('Sold', `${item.emoji} **${item.name}** x${amount}`, true)
    .addField('Gain', `+ ${emoteStrings.gem} **${numberWithCommas((amount * item.price) / 2)}**`, true)
    .setFooter({text: 'Thank you for your sale!'})
    .setTimestamp(new Date());
}

export function createLeaderboardEmbed(headers: string[], values: string[][]): MessageEmbed {
  return new MessageEmbed()
    .setDescription(`\`\`\`md\n${table([headers, ...values])}\`\`\``)
    .setColor('GOLD')
    .setTimestamp(new Date());
}
