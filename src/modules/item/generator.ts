import {ButtonInteraction, ColorResolvable, CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import {generatorDescription} from '../../utils/embed.js';
import {Item, Items, RarityColours} from '../../utils/items.js';
import User from '../../database/user/index.js';
import {emoteStrings} from '../../utils/emotes.js';
import {BuyType, UserInterface} from '../../types/user.js';
import Sentry from '../../lib/sentry.js';
import {createBuyButton, createCraftButton, createSellButton} from '../../utils/buttons.js';
import {RECIPES} from '../../utils/recipes.js';
import ResponseError from '../../utils/error.js';

export default async function handleGenerator(interaction: CommandInteraction | ButtonInteraction, item: Item) {
  let user: UserInterface;

  try {
    if (item == null) {
      throw new ResponseError('invalid item');
    }

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
      ...(item.buyable.coins ? [createBuyButton(user, item, BuyType.COINS)] : []),
      ...(item.buyable.gems ? [createBuyButton(user, item, BuyType.GEMS)] : []),
      createSellButton(user, item),
      ...(recipe != null ? [createCraftButton(user, item, recipe)] : [])
    );

    interaction.reply({
      embeds: [embed],
      components: [actionRow],
      ephemeral: true,
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
