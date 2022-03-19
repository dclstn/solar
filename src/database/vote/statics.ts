/* eslint-disable import/prefer-default-export */

import Long from 'long';

export async function get(discordId) {
  return this.findOneAndUpdate(
    {
      discordId: Long.fromString(discordId),
    },
    {},
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}
