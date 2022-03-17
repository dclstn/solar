import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import chunk from 'lodash.chunk';
import {CommandNames, CommandDescriptions, CommandOptions, Defaults, MessageComponentIds} from '../../constants.js';
import commands from '../../interactions/commands.js';
import {BUYABLE_ITEMS, Item} from '../../utils/items.js';
import components from '../../interactions/components.js';
import {emoteStrings} from '../../utils/emotes.js';
import {createItemButton} from '../../utils/buttons.js';
import client from '../../client.js';

const PAGES: Item[][] = chunk(BUYABLE_ITEMS, Defaults.STORE_PAGE_SIZE);

const SHOP_DESCRIPTION = `
${emoteStrings.success} **How to get started**
*Click on an item below to inspect information!*

${emoteStrings.success} **How do I buy/sell?**
*You should see a green or red button these will allow you 
buy or sell*
`;

const EMBED = new MessageEmbed()
  .setAuthor({name: 'Castle Mania Shop!', iconURL: client.user.avatarURL()})
  .setDescription(SHOP_DESCRIPTION)
  .setColor('GREEN')
  .setFooter({text: 'The shop was last updated:'})
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
