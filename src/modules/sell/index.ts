import {AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageActionRow} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import redlock, {userLock} from '../../redis/locks.js';
import components from '../../interactions/components.js';
import {CommandDescriptions, CommandNames, CommandOptions, MessageComponentIds} from '../../constants.js';
import {fuzzy, Item, Items} from '../../items.js';
import commands from '../../interactions/commands.js';
import User from '../../database/user/index.js';
import {sale, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import {PROFILE_BUTTON, SHOP_BUTTON} from '../../utils/buttons.js';
import autocomplete from '../../interactions/autocomplete.js';

const NAV_ROW = new MessageActionRow().addComponents(PROFILE_BUTTON, SHOP_BUTTON);

async function processSale(interaction: ButtonInteraction | CommandInteraction, item: Item, amount: number) {
  const transaction = Sentry.startTransaction({op: 'sell-transaction', name: 'Item Sale Transaction'});
  const lockSpan = transaction.startChild({op: 'acquire-lock'});
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  lockSpan.finish();

  let user = null;

  try {
    const userSpan = transaction.startChild({op: 'acquire-user'});
    user = await User.get(interaction.user);
    userSpan.finish();
    user.sell(item, amount);
    const saveSpan = transaction.startChild({op: 'save-doc'});
    await user.save();
    saveSpan.finish();

    interaction.reply({
      embeds: [sale(item, amount)],
      ephemeral: true,
      components: [NAV_ROW],
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    const releaseSpan = transaction.startChild({op: 'release-lock'});
    await lock.release();
    releaseSpan.finish();
    transaction.finish();
  }
}

commands.on(CommandNames.SELL, (interaction: CommandInteraction) => {
  const itemId = interaction.options.getString('item');
  const amount = interaction.options.getNumber('amount') || 1;
  const item = Items[itemId];
  processSale(interaction, item, amount);
});

components.on(MessageComponentIds.SELL, (interaction: ButtonInteraction, itemId: string) => {
  const item = Items[itemId];
  processSale(interaction, item, 1);
});

autocomplete.on(CommandNames.SELL, (interaction: AutocompleteInteraction) => {
  const search = interaction.options.getString('item');
  const results = fuzzy.search(search).splice(0, 24);

  interaction.respond(
    results.map((result) => ({
      name: result.item.name,
      value: result.item.id,
    }))
  );
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SELL,
  description: CommandDescriptions[CommandNames.SELL],
  options: CommandOptions[CommandNames.SELL],
});
