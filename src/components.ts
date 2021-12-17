import {ButtonInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import client from './client.js';

class Components extends EventEmitter {
  constructor() {
    super();

    client.on('interactionCreate', (interaction: ButtonInteraction) => {
      if (!interaction.isMessageComponent()) return;
      this.emit(interaction.customId, interaction);
    });
  }
}

export default new Components();
