/* eslint-disable import/prefer-default-export */
import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import chunk from 'lodash.chunk';
import {Defaults} from '../../lib/constants.js';
import {Item, Items} from '../../utils/items.js';
import {emoteStrings} from '../../utils/emotes.js';
import {createItemButton} from '../../utils/buttons.js';
import {RECIPES} from '../../utils/recipes.js';

const PAGES: Item[][] = chunk(
  Object.values(RECIPES).map(({reward}) => Items[reward]),
  Defaults.STORE_PAGE_SIZE
);

const SHOP_DESCRIPTION = `
${emoteStrings.success} **How to craft**
Click on an item below to inspect information!

${emoteStrings.success} **How do I view my crafting status?**
\`/workbench home\` will reveal your crafting processes!
`;

const EMBED = new MessageEmbed()
  .setAuthor({name: 'Castle Mania Crafting!'})
  .setDescription(SHOP_DESCRIPTION)
  .setColor('PURPLE')
  .setFooter({text: 'The shop was last updated:'})
  .setTimestamp(new Date());

const ACTION_ROWS = PAGES.map((page) => new MessageActionRow().addComponents(...page.map(createItemButton)));

export function handleRecipesPage(interaction: CommandInteraction | ButtonInteraction) {
  interaction.reply({
    embeds: [EMBED],
    ephemeral: true,
    components: ACTION_ROWS,
  });
}
