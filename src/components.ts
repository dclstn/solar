import {ButtonInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import Sentry from './sentry.js';
import client from './client.js';

class Components extends EventEmitter {
  constructor() {
    super();

    client.on('interactionCreate', (interaction: ButtonInteraction) => {
      if (!interaction.isMessageComponent()) return;

      Sentry.configureScope((scope) => {
        scope.setUser({
          id: interaction.user.id,
          username: interaction.user.username,
        });

        scope.setTag('interaction', 'button');

        this.emit(interaction.customId, interaction);
      });
    });
  }
}

export default new Components();
