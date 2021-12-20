import {ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import {CommandNames, CommandDescriptions, CommandOptions, MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';
import components from '../../components.js';
import {acquireUserLock} from '../../locks/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';

const NAV_ROW = new MessageActionRow().addComponents(
  new MessageButton().setCustomId(MessageComponentIds.PROFILE).setStyle('PRIMARY').setLabel('View Profile'),
  new MessageButton().setCustomId(MessageComponentIds.SHOP).setStyle('PRIMARY').setLabel('Open Shop')
);

async function processPurchase(interaction: CommandInteraction | ButtonInteraction, itemId: string, amount: number) {
  const lock = await acquireUserLock(interaction.user.id, 1000);

  const transaction = Sentry.startTransaction({
    op: 'buy-transaction',
    name: 'Item Purchase Transaction',
  });

  let user = null;

  try {
    user = await User.get(interaction.user);
    const item = findById(itemId);

    user.buy(item, amount);
    await user.save();

    interaction.reply({
      embeds: [success(user, `Successfully purchased\n\n${item.emoji} **${item.name}** x${amount}`)],
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
    transaction.finish();
    await lock.release();
  }
}

class Buy {
  constructor() {
    commands.on(CommandNames.BUY, this.handleCommand);
    components.on(MessageComponentIds.BUY, this.handleComponent);
  }

  handleComponent(interaction: ButtonInteraction) {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: interaction.user.id,
        username: interaction.user.username,
      });

      const itemId = interaction.message.embeds[0].title.toLowerCase();
      processPurchase(interaction, itemId, 1);
    });
  }

  handleCommand(interaction: CommandInteraction) {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: interaction.user.id,
        username: interaction.user.username,
      });

      const itemId = interaction.options.getString('item');
      const amount = interaction.options.getNumber('amount') || 1;
      processPurchase(interaction, itemId, amount);
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
