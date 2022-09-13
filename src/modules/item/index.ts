import {AutocompleteInteraction, ButtonInteraction, CommandInteraction} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../lib/constants.js';
import commands from '../../interactions/commands.js';
import {handleItemAutocomplete, Item, Items} from '../../utils/items.js';
import {ItemTypes} from '../../utils/enums.js';
import components from '../../interactions/components.js';
import handleGenerator from './generator.js';
import handleGift from './gift.js';
import autocomplete from '../../interactions/autocomplete.js';

class ItemCommand {
  constructor() {
    Object.values(Items).forEach((item) =>
      components.on(item.id, (interaction: ButtonInteraction) => this.run(interaction, item))
    );
    commands.on(CommandNames.ITEM, (interaction: CommandInteraction) =>
      this.run(interaction, Items[interaction.options.getString('item', true)])
    );
  }

  async run(interaction: CommandInteraction | ButtonInteraction, item: Item): Promise<void> {
    if (item == null) {
      return;
    }

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

autocomplete.on(CommandNames.ITEM, (interaction: AutocompleteInteraction) => {
  handleItemAutocomplete(interaction);
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.ITEM,
  description: CommandDescriptions[CommandNames.ITEM],
  options: CommandOptions[CommandNames.ITEM],
});

export default new ItemCommand();
