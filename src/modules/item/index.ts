import {CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {numberWithCommas} from '../../utils/embed.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import commands from '../../commands.js';
import {findById} from '../../items.js';
import client from '../../client.js';

class Item {
  constructor() {
    commands.on(CommandNames.ITEM, this.run);
  }

  run(interaction: CommandInteraction): void {
    const itemId = interaction.options.getString('item');
    const item = findById(itemId);
    const embed = new MessageEmbed().setTitle(item.name).setThumbnail(item.url);

    const gem = client.emojis.resolveId('768816036245536788');

    const actionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(MessageComponentIds.BUY)
        .setLabel(`Buy for ${numberWithCommas(item.price)}`)
        .setStyle('SUCCESS')
        .setEmoji(gem)
        .setDisabled(!item.buyable),
      new MessageButton()
        .setCustomId(MessageComponentIds.SELL)
        .setLabel(`Sell for ${numberWithCommas(item.price / 2)}`)
        .setEmoji(gem)
        .setStyle('DANGER')
    );

    interaction.reply({
      embeds: [embed],
      components: [actionRow],
      ephemeral: true,
    });
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.ITEM,
  description: CommandDescriptions[CommandNames.ITEM],
  options: CommandOptions[CommandNames.ITEM],
});

export default new Item();
