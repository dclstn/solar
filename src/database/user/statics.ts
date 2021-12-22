import {User} from 'discord.js';
import client from '../../client.js';

export async function get(user: User, lean?: boolean) {
  const conf = [
    {
      id: user.id,
    },
    {
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatarURL(),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ];

  return lean ? this.findOneAndUpdate(...conf).lean({methods: true}) : this.findOneAndUpdate(...conf);
}

export async function getById(id: string) {
  return this.get(await client.users.fetch(id));
}
