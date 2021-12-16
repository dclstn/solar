import {CommandInteraction, MessageEmbed} from 'discord.js';
import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import User from '../database/user/index.js';
import commands from '../commands.js';
import {Command, CommandOption} from '../types/command';

class Profile implements Command {
  name: string;
  description: string;
  options?: CommandOption[];

  constructor() {
    this.name = 'profile';
    this.description = "🔎 Return a user's profile.";
    this.options = [
      {
        name: 'user',
        description: "Inspect a selected user's profile",
        type: ApplicationCommandOptionTypes.USER,
      },
    ];

    commands.on(this.name, this.run);
  }

  async run(interaction: CommandInteraction): Promise<void> {
    const user = await User.get(interaction.options.getUser('user') || interaction.user);

    const embed: MessageEmbed = new MessageEmbed()
      .setAuthor(user.username)
      .setThumbnail(user.avatar)
      .setColor('BLURPLE');

    interaction.reply({embeds: [embed], ephemeral: true});
  }
}

commands.registerCommand(new Profile());
