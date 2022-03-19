/* eslint-disable import/prefer-default-export */

import Long from 'long';

export async function get(discordId: Long) {
  return this.findOneAndUpdate(
    {
      discordId,
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
