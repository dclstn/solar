import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import redlock, {userLock} from '../../redis/locks.js';
import components from '../../components.js';
import {CommandDescriptions, CommandNames, CommandOptions, MessageComponentIds} from '../../constants.js';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

async function processSale(interaction: ButtonInteraction | CommandInteraction, itemId: string, amount: number) {
  const transaction = Sentry.startTransaction({
    op: 'sell-transaction',
    name: 'Item Sale Transaction',
  });

  const lockSpan = transaction.startChild({op: 'acquire-lock'});
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  lockSpan.finish();

  let user = null;

  try {
    const userSpan = transaction.startChild({op: 'acquire-user'});
    user = await User.get(interaction.user);
    userSpan.finish();

    const item = findById(itemId);
    user.sell(item, amount);

    const saveSpan = transaction.startChild({op: 'save-doc'});
    await user.save();
    saveSpan.finish();

    interaction.reply({
      embeds: [success(user, `Successfully sold\n\n${item.emoji} **${item.name}** x${amount}`)],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    console.error(err);
  } finally {
    const releaseSpan = transaction.startChild({op: 'release-lock'});
    await lock.release();
    releaseSpan.finish();

    transaction.finish();
  }
}

class Sell {
  constructor() {
    commands.on(CommandNames.SELL, this.handleCommand);
    components.on(MessageComponentIds.SELL, this.handleComponent);
  }

  handleComponent(interaction: ButtonInteraction) {
    const itemId = interaction.message.embeds[0].title.toLowerCase();
    processSale(interaction, itemId, 1);
  }

  handleCommand(interaction: CommandInteraction) {
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
