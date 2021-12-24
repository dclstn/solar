import {ButtonInteraction, CommandInteraction, MessageActionRow} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {PROFILE_BUTTON, SHOP_BUTTON} from '../../utils/buttons.js';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import {purchase, warning} from '../../utils/embed.js';
import components from '../../components.js';
import redlock, {userLock} from '../../redis/locks.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

const NAV_ROW = new MessageActionRow().addComponents(PROFILE_BUTTON, SHOP_BUTTON);

async function processPurchase(interaction: ButtonInteraction | CommandInteraction, itemId: string, amount: number) {
  const transaction = Sentry.startTransaction({
    op: 'buy-transaction',
    name: 'Item Purchase Transaction',
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
    user.buy(item, amount);

    const saveSpan = transaction.startChild({op: 'save-doc'});
    await user.save();
    saveSpan.finish();

    interaction.reply({
      embeds: [purchase(item, amount)],
      components: [NAV_ROW],
      ephemeral: true,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(user, err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    const releaseSpan = transaction.startChild({op: 'release-lock'});
    await lock.release();
    releaseSpan.finish();

    transaction.finish();
  }
}

class Buy {
  constructor() {
    commands.on(CommandNames.BUY, this.handleCommand);
    components.on(MessageComponentIds.BUY, this.handleComponent);
  }

  handleComponent(interaction: ButtonInteraction) {
    const itemId = interaction.message.embeds[0].title.toLowerCase();
    processPurchase(interaction, itemId, 1);
  }

  handleCommand(interaction: CommandInteraction) {
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
