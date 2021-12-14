import {CommandInteraction, MessageEmbed} from 'discord.js';
import User, {UserInterface} from '../database/user/index.js';
import commands from '../commands.js';
import {Command} from '../types/command';

class Profile implements Command {
  name: string;
  description: string;

  constructor() {
    this.name = 'profile';
    this.description = "Return a user's profile.";

    commands.on(this.name, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    const user: UserInterface = await User.get(interaction.user);

    const embed: MessageEmbed = new MessageEmbed()
      .setAuthor(user.username)
      .setThumbnail(user.avatar)
      .setColor('BLURPLE');

    interaction.reply({embeds: [embed], ephemeral: true});
  }
}

commands.registerCommand(new Profile());
