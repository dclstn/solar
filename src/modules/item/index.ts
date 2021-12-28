import {ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import commands from '../../commands.js';
import {findById, Item, Items} from '../../items.js';
import {ItemTypes} from '../../utils/enums.js';
import components from '../../components.js';
import handleGenerator from './generator.js';
import handleGift from './gift.js';

class ItemCommand {
  constructor() {
    Object.values(Items).forEach((item) =>
      components.on(item.id, (interaction: ButtonInteraction) => this.run(interaction, item))
    );
    commands.on(CommandNames.ITEM, (interaction: CommandInteraction) =>
      this.run(interaction, findById(interaction.options.getString('item')))
    );
  }

  async run(interaction: CommandInteraction | ButtonInteraction, item: Item): Promise<void> {
    switch (item.type) {
      case ItemTypes.GENERATOR:
        handleGenerator(interaction, item);
        break;
      case ItemTypes.GIFT:
        handleGift(interaction, item);
        break;
      default:
        break;
    }
  }
}

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.ITEM,
  description: CommandDescriptions[CommandNames.ITEM],
  options: CommandOptions[CommandNames.ITEM],
});

export default new ItemCommand();
