import {AutocompleteInteraction} from 'discord.js';
import {EventEmitter} from 'events';
import {Context} from '@sentry/types';
import Sentry from '../sentry.js';
import client from '../client.js';

class Autocomplete extends EventEmitter {
  constructor() {
    super();

    client.on('interactionCreate', (interaction: AutocompleteInteraction) => {
      if (!interaction.isAutocomplete()) return;

      Sentry.configureScope((scope) => {
        scope.setUser({
          id: interaction.user.id,
          username: interaction.user.username,
        });

        scope.setTag('interaction_type', 'autocomplete');
        scope.setContext('interaction', interaction.toJSON() as Context);

        this.emit(interaction.commandName, interaction);
      });
    });
  }
}

export default new Autocomplete();
