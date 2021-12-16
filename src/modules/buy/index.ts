import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import logger from '../../logger.js';

class Buy {
  constructor() {
    commands.on(CommandNames.BUY, async (interaction: CommandInteraction) => {
      try {
        await this.run(interaction);
      } catch (err) {
        logger.error(err);
        interaction.reply({content: 'Something went wrong', ephemeral: true});
      }
    });
  }

  async run(interaction: CommandInteraction): Promise<void> {
    const itemId = interaction.options.getString('item');
    const amount = interaction.options.getNumber('amount') || 1;

    const user = await User.get(interaction.user);
    const item = findById(itemId);

    try {
      await user.buyItem(item, amount);
    } catch (err) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    await user.save();

    interaction.reply({
      embeds: [success(user, `Successfully purchased\n\n${item.emoji} **${item.name}** x${amount}`)],
      ephemeral: true,
    });
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.BUY,
  description: CommandDescriptions[CommandNames.BUY],
  options: CommandOptions[CommandNames.BUY],
});

export default new Buy();
