import {AutocompleteInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {handleItemAutocomplete, Items} from '../../utils/items.js';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../lib/constants.js';
import commands from '../../interactions/commands.js';
import User from '../../database/user/index.js';
import Sentry from '../../lib/sentry.js';
import redlock, {userLock} from '../../redis/locks.js';
import ResponseError from '../../utils/error.js';
import {success, warning} from '../../utils/embed.js';
import autocomplete from '../../interactions/autocomplete.js';

commands.on(CommandNames.MOVE, async (interaction: CommandInteraction) => {
  const fromInventory = interaction.options.getInteger('from');
  const toInventory = interaction.options.getInteger('to');
  const amount = interaction.options.getInteger('amount') || 1;

  const itemId = interaction.options.getString('item');
  const item = Items[itemId];

  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const user = await User.get(interaction.user);
    user.move(fromInventory, toInventory, item, amount);
    await user.save();

    interaction.reply({embeds: [success(`Successfully moved **${item.name}** x${amount}!`)], ephemeral: true});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    lock.release();
  }
});

autocomplete.on(CommandNames.MOVE, (interaction: AutocompleteInteraction) => {
  handleItemAutocomplete(interaction);
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.MOVE,
  description: CommandDescriptions[CommandNames.MOVE],
  options: CommandOptions[CommandNames.MOVE],
});
