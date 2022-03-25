/* eslint-disable import/prefer-default-export */
import Mongoose from 'mongoose';

export async function get(discordId: Mongoose.Schema.Types.Long) {
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
