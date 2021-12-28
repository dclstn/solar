import type {CommandInteraction} from 'discord.js';
import {success} from '../../utils/embed.js';
import commands from '../../commands.js';
import Sentry from '../../sentry.js';

export default async function reload(interaction: CommandInteraction) {
  try {
    await commands.reloadApplicationCommands();
    interaction.reply({
      ephemeral: true,
      embeds: [success('Successfully reloaded application commands')],
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
