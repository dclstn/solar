import {Interaction} from 'discord.js';
import Mongoose from 'mongoose';
import Sentry from '../../sentry.js';
import client from '../../client.js';
import Guild from '../../database/guild/index.js';
import UserModel from '../../database/user/index.js';

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    if (interaction.guild == null) {
      return;
    }

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
      UserModel.get(interaction.user),
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
});
