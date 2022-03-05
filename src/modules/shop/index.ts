import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import chunk from 'lodash.chunk';
import {CommandNames, CommandDescriptions, CommandOptions, Defaults, MessageComponentIds} from '../../constants.js';
import commands from '../../interactions/commands.js';
import {BuyableItems, Item} from '../../items.js';
import components from '../../interactions/components.js';
import {emoteStrings} from '../../utils/emotes.js';
import {createItemButton} from '../../utils/buttons.js';

const PAGES: Item[][] = chunk(BuyableItems, Defaults.STORE_PAGE_SIZE);

const SHOP_DESCRIPTION = `
${emoteStrings.success} **How to get started**
*Click on an item below to inspect information!*

${emoteStrings.success} **How do I buy/sell?**
*You should see a green or red button these will allow you 
buy or sell*

${emoteStrings.success} **Why are some buttons disabled?**
*This indicates you cannot afford that item or, do not own 
that selected item yet*

${emoteStrings.success} **Whare are my items?**
*You can see any items in your inventory via \`/profile\`*
`;

const EMBED = new MessageEmbed()
  .setTitle('Welcome to the Official CastleMania Shop!')
  .setDescription(SHOP_DESCRIPTION)
  .setColor('GREEN')
  .setFooter('The shop was last updated:')
  .setTimestamp(new Date());

const ACTION_ROWS = PAGES.map((page) => new MessageActionRow().addComponents(...page.map(createItemButton)));

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
