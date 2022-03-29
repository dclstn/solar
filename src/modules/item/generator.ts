import {ButtonInteraction, ColorResolvable, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {numberWithCommas} from '../../utils/embed.js';
import {Item, Items, RarityColours} from '../../utils/items.js';
import User from '../../database/user/index.js';
import {emoteStrings} from '../../utils/emotes.js';
import type {UserInterface} from '../../types/user.js';
import Sentry from '../../sentry.js';
import {createBuyButton, createCraftButton, createSellButton} from '../../utils/buttons.js';
import {RECIPES} from '../../utils/recipes.js';

const generatorDescription = (item: Item): string => `
Price: ${emoteStrings.gold} **${numberWithCommas(item.price)}**
Level: **${item.level}**
Coins per hour: **${item.gph}/h**
`;

export default async function handleGenerator(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    user = await User.get(interaction.user);
    const recipe = RECIPES[item.id];

    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(generatorDescription(item))
      .setThumbnail(item.url)
      .setFooter({text: 'Some items may leave or join the shop at any time!'})
      .setColor(RarityColours[item.rarity] as ColorResolvable);

    if (recipe != null) {
      embed.addField('Crafting Time', `\n${recipe.time} to complete`);
      embed.addField(
        'Crafting Requirements',
        `${recipe.requirements.map((itemId) => Items[itemId].emoji).join(' ')} ${emoteStrings.right} ${item.emoji}`
      );
    }

    const actionRow = new MessageActionRow().addComponents(
      ...(item.buyable ? [createBuyButton(user, item)] : []),
      ...(!item.buyable && recipe != null ? [createCraftButton(user, item, recipe)] : []),
      createSellButton(user, item)
    );

    interaction.reply({
      embeds: [embed],
      components: [
        actionRow,
        ...(recipe != null && item.buyable
          ? [new MessageActionRow().addComponents(createCraftButton(user, item, recipe))]
          : []),
      ],
      ephemeral: true,
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
