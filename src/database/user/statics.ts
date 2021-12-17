import {User} from 'discord.js';
import moment from 'moment';
import client from '../../client.js';

export async function get(user: User) {
  const doc = await this.findOneAndUpdate(
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
    }
  );

  // get diffMinutes instead of hours for a more accurate reading
  const diffMinutes = moment(new Date()).diff(moment(doc.updated), 'minutes');

  doc.gold += (doc.totalGoldPerHour() / 60) * diffMinutes;
  doc.updated = new Date();

  return doc;
}

export async function getById(id: string) {
  return this.get(await client.users.fetch(id));
}
