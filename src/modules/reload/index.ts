import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions} from '../../constants.js';
import commands from '../../commands.js';
import Sentry from '../../sentry.js';

class Reload {
  constructor() {
    commands.on(CommandNames.RELOAD, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    try {
      await commands.reloadApplicationCommands();
    } catch (err) {
      Sentry.captureException(err);
      interaction.reply('Failed to reload commands.');
      return;
    }

    interaction.reply('Reloaded commands.');
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.RELOAD,
  description: CommandDescriptions[CommandNames.RELOAD],
});

export default new Reload();
