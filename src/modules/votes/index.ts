import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions} from '../../constants.js';
import commands from '../../interactions/commands.js';
import Vote from '../../database/vote/index.js';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

commands.on(CommandNames.VOTE, async (interaction: CommandInteraction) => {
  const vote = await Vote.get(interaction.user.id);

  try {
    await vote.validateVotes();
    await interaction.reply({embeds: [success('Successfuly confirmed vote!')]});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.VOTE,
  description: CommandDescriptions[CommandNames.VOTE],
});
