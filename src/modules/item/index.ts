import {CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {numberWithCommas} from '../../utils/embed.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import commands from '../../commands.js';
import {findById, Item} from '../../items.js';
import User from '../../database/user/index.js';
import {emoteIds, emoteStrings} from '../../utils/emotes.js';

const itemDescription = (item: Item): string => `
Price: ${emoteStrings.gem} ${numberWithCommas(item.price)}
Level: ${item.level}
Gold per hour: ${item.gph}/h
`;

class ItemCommand {
  constructor() {
    commands.on(CommandNames.ITEM, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    const itemId = interaction.options.getString('item');
    const user = await User.get(interaction.user);

    const item = findById(itemId);
    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(itemDescription(item))
      .setThumbnail(item.url)
      .setColor('BLURPLE');

    const actionRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(MessageComponentIds.BUY)
        .setLabel(`Buy for ${numberWithCommas(item.price)}`)
        .setStyle('SUCCESS')
        .setEmoji(emoteIds.gem)
        .setDisabled(!item.buyable || item.price > user.gold),
      new MessageButton()
        .setCustomId(MessageComponentIds.SELL)
        .setLabel(`Sell for ${numberWithCommas(item.price / 2)}`)
        .setEmoji(emoteIds.gem)
        .setStyle('DANGER')
        .setDisabled(!user.hasItem(item))
    );

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.ITEM,
  description: CommandDescriptions[CommandNames.ITEM],
  options: CommandOptions[CommandNames.ITEM],
});

export default new ItemCommand();
