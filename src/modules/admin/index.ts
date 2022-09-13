import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {warning} from '../../utils/embed.js';
import commands from '../../interactions/commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, AdminSubCommandNames} from '../../lib/constants.js';
import reload from './reload.js';
import giveItem from './give.js';

commands.on(CommandNames.ADMIN, (interaction: CommandInteraction) => {
  if (interaction.user.id !== '176306508085067776') {
    interaction.reply({
      ephemeral: true,
      embeds: [warning('Admin protected')],
    });
    return;
  }

  switch (interaction.options.getSubcommand()) {
    case AdminSubCommandNames.RELOAD:
      reload(interaction);
      break;
    case AdminSubCommandNames.GIVE:
      giveItem(interaction);
      break;
    default:
      break;
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.ADMIN,
  description: CommandDescriptions[CommandNames.ADMIN],
  options: CommandOptions[CommandNames.ADMIN],
});
