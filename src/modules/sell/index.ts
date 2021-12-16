import {CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandDescriptions, CommandNames, CommandOptions} from '../../constants.js';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import logger from '../../logger.js';

class Sell {
  constructor() {
    commands.on(CommandNames.SELL, async (interaction: CommandInteraction) => {
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
      await user.sellItem(item, amount);
    } catch (err) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    await user.save();

    interaction.reply({
      embeds: [success(user, `Successfully sold\n\n${item.emoji} **${item.name}** x${amount}`)],
      ephemeral: true,
    });
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SELL,
  description: CommandDescriptions[CommandNames.SELL],
  options: CommandOptions[CommandNames.SELL],
});

export default new Sell();
