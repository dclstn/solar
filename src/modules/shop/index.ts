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

const EMBED = new MessageEmbed()
  .setTitle('Welcome to the Official CastleMania Shop!')
  .setDescription(SHOP_DESCRIPTION)
  .setColor('BLURPLE');

const ACTION_ROWS = PAGES.map((page) =>
  new MessageActionRow().addComponents(
    ...page.map((item) =>
      new MessageButton().setCustomId(item.id).setEmoji(item.emojiId).setStyle('PRIMARY').setLabel('')
    )
  )
);

class Shop {
  constructor() {
    commands.on(CommandNames.SHOP, this.run);
    components.on(MessageComponentIds.SHOP, this.run);
    components.on(MessageComponentIds.NEXT, this.run);
    components.on(MessageComponentIds.LAST, this.run);
  }

  run(interaction: CommandInteraction | ButtonInteraction) {
    interaction.reply({
      embeds: [EMBED],
      ephemeral: true,
      components: ACTION_ROWS,
    });
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SHOP,
  options: CommandOptions[CommandNames.SHOP],
  description: CommandDescriptions[CommandNames.SHOP],
});

export default new Shop();
