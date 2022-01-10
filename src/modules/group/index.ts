import type {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions, GroupSubCommandNames} from '../../constants.js';
import commands from '../../commands.js';
import deposit from './deposit.js';
import create from './create.js';
import invite from './invite.js';
import kick from './kick.js';
import home from './home.js';

commands.on(CommandNames.GROUP, (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case GroupSubCommandNames.HOME:
      home(interaction);
      break;
    case GroupSubCommandNames.DEPOSIT:
      deposit(interaction);
      break;
    case GroupSubCommandNames.INVITE:
      invite(interaction);
      break;
    case GroupSubCommandNames.KICK:
      kick(interaction);
      break;
    case GroupSubCommandNames.CREATE:
    default:
      create(interaction);
      break;
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.GROUP,
  description: CommandDescriptions[CommandNames.GROUP],
  options: CommandOptions[CommandNames.GROUP],
});
