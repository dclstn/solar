import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import commands from '../../commands.js';
import {
  CommandDescriptions,
  CommandNames,
  CommandOptions,
  LeaderbordSubCommands,
  MessageComponentIds,
} from '../../constants.js';
import localLeaderboard from './local.js';
import globalLeaderboard from './global.js';
import components from '../../components.js';

commands.on(CommandNames.LEADERBOARD, (interaction) => {
  switch (interaction.options.getSubcommand()) {
    case LeaderbordSubCommands.LOCAL:
      localLeaderboard(interaction);
      break;
    case LeaderbordSubCommands.GLOBAL:
      globalLeaderboard(interaction);
      break;
    default:
      break;
  }
});

components.on(MessageComponentIds.GLOBAL_LB_USER_MONEY, globalLeaderboard);
components.on(MessageComponentIds.LOCAL_LB_USER_MONEY, localLeaderboard);

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.LEADERBOARD,
  description: CommandDescriptions[CommandNames.LEADERBOARD],
  options: CommandOptions[CommandNames.LEADERBOARD],
});
