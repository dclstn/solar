import type {CommandInteraction} from 'discord.js';
import Mongoose from 'mongoose';
import {MessageEmbed} from 'discord.js';
import {warning, numberWithCommas} from '../../utils/embed.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import {emoteStrings} from '../../utils/emotes.js';
import type {GroupInterface} from '../../types/group.js';

const createGroupDescription = (group: GroupInterface) => `
${emoteStrings.gem} Gems: **${numberWithCommas(group.money)}**
🌍 Members: ${group.users.length}
`;

export default async function home(interaction: CommandInteraction) {
  try {
    const id = interaction.user.id as unknown as Mongoose.Schema.Types.Long;
    const user = await User.findOne({discordId: id}).populate('group');

    if (user?.group == null) {
      throw new ResponseError('Invalid user');
    }

    await user.group.populate('users.user');

    const embed = new MessageEmbed()
      .setTitle(user.group.name)
      .setDescription(createGroupDescription(user.group))
      .setColor('BLURPLE');

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
}
