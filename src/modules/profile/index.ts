import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {profileEmbed} from '../../utils/embed.js';
import {
  CommandNames,
  CommandDescriptions,
  CommandOptions,
  UserCommandNames,
  MessageComponentIds,
} from '../../constants.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import type {UserInterface} from '../../types/user.js';
import components from '../../components.js';
import Sentry from '../../sentry.js';

class Profile {
  constructor() {
    commands.on(CommandNames.PROFILE, this.run);
    commands.on(UserCommandNames.PROFILE, this.run);
    components.on(MessageComponentIds.PROFILE, this.handleMessageComponent);
  }

  async handleMessageComponent(interaction: ButtonInteraction) {
    let user: UserInterface;

    try {
      user = await User.get(interaction.user);
      interaction.reply({embeds: [profileEmbed(user)], ephemeral: true});
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  async run(interaction: CommandInteraction): Promise<void> {
    const interactionUser = interaction.options.getUser('user') || interaction.user;
    let user: UserInterface;

    try {
      user = await User.get(interactionUser);
      interaction.reply({embeds: [profileEmbed(user)], ephemeral: true});
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.PROFILE,
  description: CommandDescriptions[CommandNames.PROFILE],
  options: CommandOptions[CommandNames.PROFILE],
});

commands.registerCommand({
  type: ApplicationCommandTypes.USER,
  name: UserCommandNames.PROFILE,
});

export default new Profile();
