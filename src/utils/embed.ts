import {UserInterface} from 'database/user';
import {MessageEmbed} from 'discord.js';
import emotes from './emotes.js';

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

  return new MessageEmbed().setAuthor(user.username, user.avatar).setDescription(emojis.join(' ')).setColor('BLURPLE');
}
