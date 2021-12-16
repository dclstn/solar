import {CommandInteraction} from 'discord.js';
import {ApplicationCommandOptionTypes} from 'discord.js/typings/enums';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import {Command, CommandOption} from '../../types/command';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import logger from '../../logger.js';

class Sell implements Command {
  name: string;
  description: string;
  options: CommandOption[];

  constructor() {
    this.name = 'sell';
    this.description = '🛍️ Sell an item for gold';
    this.options = [
      {
        name: 'item',
        description: 'Select the item you wish to buy',
        type: ApplicationCommandOptionTypes.STRING,
        required: true,
      },
      {
        name: 'amount',
        description: 'How many?',
        min_value: 1,
        type: ApplicationCommandOptionTypes.NUMBER,
      },
    ];

    commands.on(this.name, async (interaction: CommandInteraction) => {
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

commands.registerCommand(new Sell());
