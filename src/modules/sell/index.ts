import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {acquireUserLock} from '../../locks/index.js';
import components from '../../components.js';
import {CommandDescriptions, CommandNames, CommandOptions, MessageComponentIds} from '../../constants.js';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import logger from '../../logger.js';

async function processSale(interaction: ButtonInteraction | CommandInteraction, itemId: string, amount: number) {
  const lock = await acquireUserLock(interaction.user.id, 1000);
  let user = null;

  try {
    user = await User.get(interaction.user);
    const item = findById(itemId);

    user.sell(item, amount);
    await user.save();

    interaction.reply({
      embeds: [success(user, `Successfully sold\n\n${item.emoji} **${item.name}** x${amount}`)],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    logger.error(err);
  } finally {
    await lock.release();
  }
}

class Sell {
  constructor() {
    commands.on(CommandNames.SELL, this.handleChatInputInteraction);
    components.on(MessageComponentIds.SELL, this.handleMessageComponentInteraction);
  }

  handleMessageComponentInteraction(interaction: ButtonInteraction) {
    const itemId = interaction.message.embeds[0].title.toLowerCase();
    processSale(interaction, itemId, 1);
  }

  handleChatInputInteraction(interaction: CommandInteraction) {
    const itemId = interaction.options.getString('item');
    const amount = interaction.options.getNumber('amount') || 1;
    processSale(interaction, itemId, amount);
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.SELL,
  description: CommandDescriptions[CommandNames.SELL],
  options: CommandOptions[CommandNames.SELL],
});

export default new Sell();
