import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import components from '../../components.js';
import {CommandDescriptions, CommandNames, CommandOptions, MessageComponentIds} from '../../constants.js';
import {findById} from '../../items.js';
import commands from '../../commands.js';
import User from '../../database/user/index.js';
import {success, warning} from '../../utils/embed.js';

async function processSale(interaction: ButtonInteraction | CommandInteraction, itemId: string, amount: number) {
  const user = await User.get(interaction.user);
  const item = findById(itemId);

  try {
    user.sellItem(item, amount);
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
