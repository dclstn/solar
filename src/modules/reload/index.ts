import type {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions} from '../../constants.js';
import commands from '../../commands.js';
import Sentry from '../../sentry.js';

class Reload {
  constructor() {
    commands.on(CommandNames.RELOAD, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    // TODO: add admin flag to user obj
    if (interaction.user.id !== '176306508085067776') {
      interaction.reply('Admin protected');
      return;
    }

    try {
      await commands.reloadApplicationCommands();
      interaction.reply('Reloaded commands.');
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.RELOAD,
  description: CommandDescriptions[CommandNames.RELOAD],
});

export default new Reload();
