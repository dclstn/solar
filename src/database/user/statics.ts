import {User} from 'discord.js';
import client from '../../client.js';

export async function get(user: User, email: string, locale: string) {
  return this.findOneAndUpdate(
    {
      discordId: user.id,
    },
    {
      username: user.username,
      avatar: user.avatarURL(),
      email,
      locale,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function upsert(id: string, email: string, locale: string) {
  return this.findOneAndUpdate(
    {
      discordId: id,
    },
    {
      email,
      locale,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function getById(id: string, email: string, locale: string) {
  return this.get(await client.users.fetch(id), email, locale);
}
