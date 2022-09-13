import {AutocompleteInteraction, CommandInteraction} from 'discord.js';
import {findById, handleItemAutocomplete} from '../../utils/items.js';
import ResponseError from '../../utils/error.js';
import {success, warning} from '../../utils/embed.js';
import Sentry from '../../lib/sentry.js';
import User from '../../database/user/index.js';
import redlock, {userLock} from '../../redis/locks.js';
import autocomplete from '../../interactions/autocomplete.js';
import {CommandNames, AdminSubCommandNames} from '../../lib/constants.js';

autocomplete.on(CommandNames.ADMIN, (interaction: AutocompleteInteraction) => {
  if (interaction.options.getSubcommand() !== AdminSubCommandNames.GIVE) return;

  handleItemAutocomplete(interaction);
});

export default async function giveItem(interaction: CommandInteraction) {
  const discordUser = interaction.options.getUser('user');
  const itemId = interaction.options.getString('item');
  const amount = interaction.options.getNumber('amount');

  const lock = await redlock.acquire([userLock(discordUser)], 1000);

  try {
    const user = await User.get(discordUser);
    const item = findById(itemId);
    user.add(item, amount);
    await user.save();

    interaction.reply({
      ephemeral: true,
      embeds: [success(`Successfully added ${amount}x **${item.name}** to **${user.username}**`)],
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    lock.release();
  }
}
