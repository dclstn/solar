import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../commands.js';
import {Command} from '../../types/command';

class Reload implements Command {
  type: ApplicationCommandTypes.CHAT_INPUT;
  name: string;
  description: string;

  constructor() {
    this.name = 'reload';
    this.description = 'Reloads all application commands';

    commands.on(this.name, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    try {
      await commands.reloadApplicationCommands();
    } catch (err) {
      console.error(err);
      interaction.reply('Failed to reload commands.');
      return;
    }

    interaction.reply('Reloaded commands.');
  }
}

commands.registerCommand(new Reload());
