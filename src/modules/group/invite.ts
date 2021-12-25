import {CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import Mongoose from 'mongoose';
import {ACCEPT_INVITE_BUTTON, DECLINE_INVITE_BUTTON} from '../../utils/buttons.js';
import {Roles} from '../../utils/enums.js';
import {success, warning} from '../../utils/embed.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';
import type {GroupInterface} from '../../types/group.js';

const actionRow = new MessageActionRow().addComponents(ACCEPT_INVITE_BUTTON, DECLINE_INVITE_BUTTON);

const inviteEmbed = (group: GroupInterface) =>
  new MessageEmbed().setColor('GREEN').setTitle(group.name).setDescription('Has invited you to their kingdom!');

export default async function invite(interaction: CommandInteraction) {
  try {
    const id = interaction.user.id as unknown as Mongoose.Schema.Types.Long;
    const inviter = await User.findOne({id}).populate('group');
    const discordInvitee = interaction.options.getUser('user');
    const invitee = await User.get(discordInvitee);

    if (inviter == null || inviter.group == null) {
      throw new ResponseError('You do not belong to a kingdom');
    }

    // TODO: make func for this
    if (
      ![Roles.MODERATOR, Roles.OWNER].includes(inviter.group.users.find(({user}) => user._id.equals(inviter._id)).role)
    ) {
      throw new ResponseError('Invalid permissions in group to perform this action');
    }

    if (invitee.group != null) {
      throw new ResponseError("The user you're trying to invite belongs to a kingdom");
    }

    if (inviter.group.users.find(({user}) => user._id.equals(invitee._id))) {
      throw new ResponseError('This user is in your kingdom');
    }

    try {
      await discordInvitee.send({
        embeds: [inviteEmbed(inviter.group)],
        components: [actionRow],
      });
    } catch (err) {
      throw new ResponseError('Unable to send DM to user');
    }

    interaction.reply({
      embeds: [success(`Sent invite to **${discordInvitee.username}**!`)],
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
