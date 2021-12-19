import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import chunk from 'lodash.chunk';
import {CommandNames, CommandDescriptions, CommandOptions, Defaults, MessageComponentIds} from '../../constants.js';
import commands from '../../commands.js';
import {BuyableItems, Item} from '../../items.js';
import components from '../../components.js';

const PAGES: Item[][] = chunk(BuyableItems, Defaults.STORE_PAGE_SIZE);

function renderPage(interaction: CommandInteraction | ButtonInteraction, pageIndex: number): void {
  const page = PAGES[pageIndex - 1];
  const embed = new MessageEmbed().setTitle(`Page ${pageIndex}`).setDescription(page.toString());

  const itemButtons = page.map((item) =>
    new MessageButton().setCustomId(item.id).setEmoji(item.emojiId).setStyle('SECONDARY').setLabel('')
  );

  const actionRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(MessageComponentIds.LAST)
      .setLabel('Last')
      .setStyle('PRIMARY')
      .setDisabled(pageIndex === 1),
    ...itemButtons,
    new MessageButton()
      .setCustomId(MessageComponentIds.NEXT)
      .setLabel('Next')
      .setStyle('PRIMARY')
      .setDisabled(pageIndex >= PAGES.length)
  );

  interaction.reply({embeds: [embed], ephemeral: true, components: [actionRow]});
}

class Shop {
  constructor() {
    commands.on(CommandNames.SHOP, this.run);
    components.on(MessageComponentIds.NEXT, this.next);
    components.on(MessageComponentIds.LAST, this.last);
  }

  last(interaction: ButtonInteraction): void {
    const pageIndex = Number(interaction.message.embeds[0].title.split(' ')[1]) - 1;
    renderPage(interaction, pageIndex);
  }

  next(interaction: ButtonInteraction): void {
    const pageIndex = Number(interaction.message.embeds[0].title.split(' ')[1]) + 1;
    renderPage(interaction, pageIndex);
  }

  run(interaction: CommandInteraction) {
    const pageIndex = interaction.options.getInteger('page') || 1;
    renderPage(interaction, pageIndex);
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SHOP,
  options: CommandOptions[CommandNames.SHOP],
  description: CommandDescriptions[CommandNames.SHOP],
});

export default new Shop();
