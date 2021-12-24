/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Interaction} from 'discord.js';
import client from '../../client.js';
import Server from '../../database/sever/index.js';
import User from '../../database/user/index.js';

class ServerLeaderboard {
  constructor() {
    client.on('interactionCreate', this.run);
  }

  async run(interaction: Interaction) {
    const [server, user] = await Promise.all([
      Server.findOneAndUpdate(
        {
          // @ts-ignore
          guildId: interaction.guild.id,
        },
        {
          name: interaction.guild.name,
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

    const found = server.users.find((serverUser) => serverUser._id.equals(user._id));

    if (!found) {
      server.users.push(user._id);

      if (interaction.guild.ownerId === interaction.user.id) {
        server.set('owner', user._id);
      }

      await server.save();
    }
  }
}

export default new ServerLeaderboard();
