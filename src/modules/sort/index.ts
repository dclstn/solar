import type {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import Sentry from '../../sentry.js';
import redlock, {userLock} from '../../redis/locks.js';
import {CommandNames, CommandDescriptions, CommandOptions, SortCommandNames} from '../../constants.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import {findById} from '../../items.js';
import {success} from '../../utils/embed.js';

class Sort {
  constructor() {
    commands.on(CommandNames.SORT, this.run);
  }

  async run(interaction: CommandInteraction) {
    const lock = await redlock.acquire([userLock(interaction.user)], 1000);

    try {
      const user = await User.get(interaction.user);
      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case SortCommandNames.ASCENDING:
          user.sort((a, b) => a.id.localeCompare(b.id));
          user.sort((a, b) => findById(a.id).gph - findById(b.id).gph);
          break;
        case SortCommandNames.DECENDING:
          user.sort((a, b) => a.id.localeCompare(b.id));
          user.sort((a, b) => findById(b.id).gph - findById(a.id).gph);
          break;
        case SortCommandNames.RANDOM:
          user.sort(() => (Math.random() > 0.5 ? 1 : -1));
          break;
        case SortCommandNames.AGE:
          user.sort((a, b) => a.id.localeCompare(b.id));
          user.sort((a, b) => a.purchased.getTime() - b.purchased.getTime());
          break;
        default:
          return;
      }

      await user.save();

      interaction.reply({
        embeds: [success(user, `Successfully sorted your inventories by \`${subCommand}\``)],
        ephemeral: true,
      });
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      lock.release();
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SORT,
  description: CommandDescriptions[CommandNames.SORT],
  options: CommandOptions[CommandNames.SORT],
});

export default new Sort();
