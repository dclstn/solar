import {AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageActionRow} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {createBuyButton, PROFILE_BUTTON} from '../../utils/buttons.js';
import {BUYABLE_ITEMS, DEFAULT_BUYABLE_ITEMS, fuzzy, Item, Items} from '../../utils/items.js';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import {purchase, warning} from '../../utils/embed.js';
import components from '../../interactions/components.js';
import redlock, {userLock} from '../../redis/locks.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import autocomplete from '../../interactions/autocomplete.js';

async function processPurchase(interaction: ButtonInteraction | CommandInteraction, item: Item, amount: number) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const user = await User.get(interaction.user);
    user.buy(item, amount);
    await user.save();

    const NAV_ROW = new MessageActionRow().addComponents(createBuyButton(user, item, 'Buy Another'), PROFILE_BUTTON);

    interaction.reply({embeds: [purchase(item, amount)], components: [NAV_ROW], ephemeral: true});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
}

commands.on(CommandNames.BUY, (interaction: CommandInteraction) => {
  const itemId = interaction.options.getString('item');
  const amount = interaction.options.getNumber('amount') || 1;
  const item = Items[itemId];
  processPurchase(interaction, item, amount);
});

components.on(MessageComponentIds.BUY, (interaction: ButtonInteraction, itemId: string) => {
  const item = Items[itemId];
  processPurchase(interaction, item, 1);
});

autocomplete.on(CommandNames.BUY, (interaction: AutocompleteInteraction) => {
  const search = interaction.options.getString('item');
  const results =
    search.length === 0
      ? DEFAULT_BUYABLE_ITEMS.map((item) => ({
          name: item.name,
          value: item.id,
        }))
      : fuzzy
          .search(search)
          .splice(0, 24)
          .map((result) => ({
            name: result.item.name,
            value: result.item.id,
          }));

  interaction.respond(results);
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.BUY,
  description: CommandDescriptions[CommandNames.BUY],
  options: CommandOptions[CommandNames.BUY],
});
