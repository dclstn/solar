import {ButtonInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Context} from '@sentry/types';
import Sentry from '../sentry.js';
import client from '../client.js';

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

        scope.setTag('interaction_type', 'button');
        scope.setContext('interaction', interaction.toJSON() as Context);

        const [customId, ...args] = interaction.customId.split('.');
        this.emit(customId, interaction, ...args);
      });
    });
  }
}

export default new Components();
