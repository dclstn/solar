import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import chunk from 'lodash.chunk';
import {CommandNames, CommandDescriptions, CommandOptions, Defaults, MessageComponentIds} from '../../constants.js';
import commands from '../../commands.js';
import {BuyableItems, Item} from '../../items.js';
import components from '../../components.js';

const PAGES: Item[][] = chunk(BuyableItems, Defaults.STORE_PAGE_SIZE);

const SHOP_DESCRIPTION = `
'**How to get started**
*Click on a button below to inspect information!*'

`;

function renderPage(interaction: CommandInteraction | ButtonInteraction, pageIndex: number): void {
  // const page = PAGES[pageIndex - 1];
  const embed = new MessageEmbed()
    .setTitle('Welcome to the Official CastleMania Shop!')
    .setDescription(SHOP_DESCRIPTION)
    .setColor('BLURPLE');

  const actionRows = PAGES.map((page) =>
    new MessageActionRow().addComponents(
      ...page.map((item) =>
        new MessageButton().setCustomId(item.id).setEmoji(item.emojiId).setStyle('PRIMARY').setLabel('')
      )
    )
  );

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
    components: actionRows,
  });
}

class Shop {
  constructor() {
    commands.on(CommandNames.SHOP, this.run);
    components.on(MessageComponentIds.SHOP, (interaction) => renderPage(interaction, 1));
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
