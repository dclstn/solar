import {CommandInteraction, Interaction} from 'discord.js';
import Mongoose from 'mongoose';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import Sentry from '../../sentry.js';
import client from '../../client.js';
import Guild from '../../database/guild/index.js';
import User from '../../database/user/index.js';
import commands from '../../commands.js';
import {CommandDescriptions, CommandNames, CommandOptions, LeaderbordSubCommands} from '../../constants.js';
import localLeaderboard from './local.js';
import globalLeaderboard from './global.js';

class Leaderboards {
  constructor() {
    client.on('interactionCreate', this.logInteraction);
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
  }

  async logInteraction(interaction: Interaction) {
    try {
      const [guild, user] = await Promise.all([
        Guild.findOneAndUpdate(
          {
            guildId: interaction.guild.id as unknown as Mongoose.Schema.Types.Long,
          },
          {
            name: interaction.guild.name,
            icon: interaction.guild.icon,
            memberCount: interaction.guild.memberCount,
            preferredLocale: interaction.guild.preferredLocale,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        ),
        User.get(interaction.user),
      ]);

      if (!guild.users.find((serverUser) => serverUser._id.equals(user._id))) {
        guild.users.push(user._id);

        if (interaction.guild.ownerId === interaction.user.id) {
          guild.set('owner', user._id);
        }

        await guild.save();
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.LEADERBOARD,
  description: CommandDescriptions[CommandNames.LEADERBOARD],
  options: CommandOptions[CommandNames.LEADERBOARD],
});

export default new Leaderboards();
