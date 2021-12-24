/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {CommandInteraction} from 'discord.js';
import {Roles} from '../../utils/enums.js';
import {warning} from '../../utils/embed.js';
import User from '../../database/user/index.js';
import Sentry from '../../sentry.js';
import ResponseError from '../../utils/error.js';

export default async function invite(interaction: CommandInteraction) {
  try {
    // @ts-ignore
    const inviter = await User.findOne({id: interaction.user.id}).populate('group');
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
      await discordInvitee.send('Hello');
    } catch (err) {
      throw new ResponseError('Unable to send DM to user');
    }
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
}
