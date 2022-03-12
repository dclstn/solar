import {Interaction, MessageEmbed} from 'discord.js';
import Mongoose from 'mongoose';
import Sentry from '../../sentry.js';
import client from '../../client.js';
import Guild from '../../database/guild/index.js';
import UserModel from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';

const WELCOME_EMBED = (user: UserInterface) =>
  new MessageEmbed()
    .setTitle(`Hi ${user.username}, we've made some changes...`)
    .setColor('GREEN')
    .setTimestamp(new Date()).setDescription(`
**CastleMania has now been updated to V2**
The Changes:
• The economy has been reset, legacy users will start with a suprise.
• Gifts (previously named Lootboxes) are now located within your inventory
• Groups (Kingdoms) will remain the same but with limited features
• The removal of text command support, but do not fret we now have buttons!
• Pets have been removed, could see a revival in the future!
We apologize for any inconvenience this has caused, but we feel it was a nessecary change.
`);

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

      // Remove this at a later date
      try {
        await interaction.user.send({embeds: [WELCOME_EMBED(user)]});
        // eslint-disable-next-line no-empty
      } catch (_) {}

      if (interaction.guild.ownerId === interaction.user.id) {
        guild.set('owner', user._id);
      }

      await guild.save();
    }
  } catch (err) {
    Sentry.captureException(err);
  }
});
