import {MessageEmbed} from 'discord.js';
import table from 'text-table';
import {Item} from './items.js';
import {emoteStrings} from './emotes.js';
import {BuyType} from '../types/user.js';

export function numberWithCommas(x: number): string {
  const y = x < 100 ? x.toFixed(2) : Math.floor(x);
  return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const slotsRow = (symbols: Item[], left = emoteStrings.blank, right = emoteStrings.blank) =>
  [left, left, ...symbols.map((item) => item.emoji), right, right].join(' ');

const slotsDisplay = (symbols: Item[][], message: string) => `
${`${slotsRow(symbols[0])}\n${slotsRow(symbols[1])}`}
${slotsRow(symbols[2], emoteStrings.right, emoteStrings.left)}
${`${slotsRow(symbols[3])}\n${slotsRow(symbols[4])}`}

${message}
`;

export const generatorDescription = (item: Item): string => `${
  item.buyable.coins ? `Price: ${emoteStrings.gold} **${numberWithCommas(item.price.coins)}**` : ''
}${item.buyable.gems ? `Price: ${emoteStrings.gem} **${numberWithCommas(item.price.gems)}**` : ''}
Level: **${item.level}**
Coins per hour: **${item.gph}/h**
`;

export function success(content: string): MessageEmbed {
  return new MessageEmbed().setColor('GREEN').setDescription(`${emoteStrings.success} ${content}`);
}

export function warning(content: string): MessageEmbed {
  return new MessageEmbed().setColor('ORANGE').setDescription(`${emoteStrings.neutral} ${content}`);
}

export function purchase(item: Item, amount: number, currency: BuyType): MessageEmbed {
  // TODO: refactor this
  return new MessageEmbed()
    .setColor('GREEN')
    .addField('Purchase', `${item.emoji} **${item.name}** x${amount}`, true)
    .addField(
      'Cost',
      `- ${currency === BuyType.COINS ? emoteStrings.gold : emoteStrings.gem} **${numberWithCommas(
        amount * (currency === BuyType.COINS ? item.price.coins : item.price.gems)
      )}**`,
      true
    )
    .setFooter({text: 'Thank you for your purchase!'})
    .setTimestamp(new Date());
}

export function sale(item: Item, amount: number): MessageEmbed {
  return new MessageEmbed()
    .setColor('RED')
    .addField('Sold', `${item.emoji} **${item.name}** x${amount}`, true)
    .addField('Gain', `+ ${emoteStrings.gold} **${numberWithCommas((amount * item.price.coins) / 2)}**`, true)
    .setFooter({text: 'Thank you for your sale!'})
    .setTimestamp(new Date());
}

export function createLeaderboardEmbed(headers: string[], values: string[][]): MessageEmbed {
  return new MessageEmbed()
    .setDescription(`\`\`\`md\n${table([headers, ...values])}\`\`\``)
    .setColor('GOLD')
    .setTimestamp(new Date());
}

export function slotsWin(generators: Item[][], multiplier: number, coins: string) {
  return new MessageEmbed()
    .setAuthor({name: '🎰 Slot Machine!'})
    .setColor('GREEN')
    .setDescription(slotsDisplay(generators, `**You Won!** - ${multiplier}x Combo!\n+${emoteStrings.gold}${coins}`));
}

export function slotsLose(generators: Item[][], coins: string) {
  return new MessageEmbed()
    .setAuthor({name: '🎰 Slot Machine!'})
    .setColor('RED')
    .setDescription(slotsDisplay(generators, `**You Lost!**\n-${emoteStrings.gold}${coins}`));
}
