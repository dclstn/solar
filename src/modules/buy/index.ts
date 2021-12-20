import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import components from '../../components.js';
import {acquireUserLock} from '../../locks/index.js';
import ResponseError from '../../utils/error.js';
import logger from '../../logger.js';

async function processPurchase(interaction: CommandInteraction | ButtonInteraction, itemId: string, amount: number) {
  const lock = await acquireUserLock(interaction.user.id, 1000);
  let user = null;

  try {
    user = await User.get(interaction.user);
    const item = findById(itemId);

    user.buy(item, amount);
    await user.save();

    interaction.reply({
      embeds: [success(user, `Successfully purchased\n\n${item.emoji} **${item.name}** x${amount}`)],
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

class Buy {
  constructor() {
    commands.on(CommandNames.BUY, this.handleChatInputInteraction);
    components.on(MessageComponentIds.BUY, this.handleMessageComponentInteraction);
  }

  handleMessageComponentInteraction(interaction: ButtonInteraction) {
    const itemId = interaction.message.embeds[0].title.toLowerCase();
    processPurchase(interaction, itemId, 1);
  }

  handleChatInputInteraction(interaction: CommandInteraction) {
    const itemId = interaction.options.getString('item');
    const amount = interaction.options.getNumber('amount') || 1;
    processPurchase(interaction, itemId, amount);
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.BUY,
  description: CommandDescriptions[CommandNames.BUY],
  options: CommandOptions[CommandNames.BUY],
});

export default new Buy();
