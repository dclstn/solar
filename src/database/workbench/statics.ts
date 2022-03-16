/* eslint-disable import/prefer-default-export */
import {User} from 'discord.js';

export async function get(user: User) {
  return this.findOneAndUpdate(
    {
      discordId: user.id,
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
