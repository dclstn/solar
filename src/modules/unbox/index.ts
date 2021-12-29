import {ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {emoteIds, emoteStrings} from '../../utils/emotes.js';
import {createUnboxButton, PROFILE_BUTTON} from '../../utils/buttons.js';
import redlock, {userLock} from '../../redis/locks.js';
import {Item, Items} from '../../items.js';
import {ItemTypes} from '../../utils/enums.js';
import components from '../../components.js';
import {MessageComponentIds} from '../../constants.js';
import User from '../../database/user/index.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import {numberWithCommas, warning} from '../../utils/embed.js';

const generatorDescription = (item: Item): string => `
Price: ${emoteStrings.gem} **${numberWithCommas(item.price)}**
Level: **${item.level}**
Gems per hour: **${item.gph}/h**
`;

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const GIFTS = Object.values(Items).filter(({type}) => type === ItemTypes.GIFT);

async function unboxGift(interaction: ButtonInteraction, gift: Item) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const user = await User.get(interaction.user);
    const item = user.unbox(gift);
    await user.save();

    const embed = new MessageEmbed()
      .setTitle(`🎊 You unboxed ${VOWELS.includes(item.name.charAt(0)) ? 'an' : 'a'} ${item.name}!`)
      .setDescription(generatorDescription(item))
      .setThumbnail(item.url)
      .setFooter('Some items may leave or join the shop at any time!')
      .setColor('GREEN');

    const actionRow = new MessageActionRow().addComponents(
      PROFILE_BUTTON,
      createUnboxButton(user, gift, true),
      new MessageButton()
        .setCustomId(MessageComponentIds.SELL)
        .setLabel(`Sell for ${numberWithCommas(item.price / 2)}`)
        .setEmoji(emoteIds.gem)
        .setStyle('DANGER')
        .setDisabled(!user.has(item))
    );

    interaction.reply({embeds: [embed], components: [actionRow], ephemeral: true});
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
}

GIFTS.forEach((gift) =>
  components.on(`${MessageComponentIds.UNBOX}.${gift.id}`, (interaction: ButtonInteraction) => {
    unboxGift(interaction, gift);
  })
);
