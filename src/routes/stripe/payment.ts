import {PaymentIds} from '../../constants.js';
import {Items, ItemIds} from '../../items.js';
import User from '../../database/user/index.js';
import client from '../../client.js';
import {success} from '../../utils/embed.js';

export const handleLogs = {};

export const handlePurchase = {
  [PaymentIds.GIFTS.FIVE]: async (client_reference_id: string) => {
    const discordUser = await client.users.fetch(client_reference_id);
    const user = await User.get(discordUser);

    try {
      discordUser.send({embeds: [success('Thank you for your purchase!')]});
      // eslint-disable-next-line no-empty
    } catch (_) {}

    user.add(Items[ItemIds.GIFT], 5);
    await user.save();
  },
};
