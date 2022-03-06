import type {CommandInteraction} from 'discord.js';
import {success} from '../../utils/embed.js';
import commands from '../../interactions/commands.js';
import Sentry from '../../sentry.js';

export default async function reload(interaction: CommandInteraction) {
  const global = interaction.options.getBoolean('global');

  try {
    await commands.reloadApplicationCommands(global);
    interaction.reply({
      ephemeral: true,
      embeds: [success('Successfully reloaded application commands')],
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
