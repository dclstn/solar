import type {CommandInteraction} from 'discord.js';
import _ from 'lodash';
import Group from '../../database/group/index.js';
import Sentry from '../../sentry.js';

export default async function migrate(interaction: CommandInteraction) {
  try {
    interaction.reply('Migrated');

    await Group.aggregate([
      {
        $group: {
          _id: {name: '$name', value: '$value'},
          doc: {$last: '$$ROOT'}, // Retrieve only last doc in a group
        },
      },
      {
        $replaceRoot: {newRoot: '$doc'}, // replace doc as object as new root of document
      },
      {
        $out: 'collection_new',
      }, // Test above aggregation & then use this
    ]);
  } catch (err) {
    Sentry.captureException(err);
  }
}
