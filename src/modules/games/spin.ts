import {CommandInteraction, MessageActionRow, MessageEmbed} from 'discord.js';
import cron from 'node-cron';
import {success, warning} from '../../utils/embed.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../lib/sentry.js';
import redlock, {userLock} from '../../redis/locks.js';
import User from '../../database/user/index.js';
import Cooldown from '../../database/cooldown/index.js';
import {createToggleNotificationButton} from '../../utils/buttons.js';

const DAILY_WHEEL_SPIN_QUERY = {
  'wheelSpin.endDate': {$lte: new Date()},
  'wheelSpin.notified': false,
  'wheelSpin.shouldNotify': true,
};

const cronJob = cron.schedule('*/60 * * * * *', async () => {
  const readyCooldowns = await Cooldown.find(DAILY_WHEEL_SPIN_QUERY);

  if (readyCooldowns.length === 0) {
    return;
  }

  await Cooldown.updateMany(DAILY_WHEEL_SPIN_QUERY, {'wheelSpin.notified': true});

  for await (const cooldown of readyCooldowns) {
    const user = await User.findOne({discordId: cooldown.discordId});

    if (user == null) {
      continue;
    }

    await user.notify({embeds: [success('Your daily wheel-spin is ready!')]});
  }
});

cronJob.start();

const LOSS_IMAGE = 'https://castlemania.bot/imgs/slot_machine_loss.gif';
const WIN_IMAGE = 'https://castlemania.bot/imgs/slot_machine_win_legendary.gif';

const createEmbed = (win: boolean) =>
  new MessageEmbed()
    .setImage(win ? WIN_IMAGE : LOSS_IMAGE)
    .setColor(win ? 'GREEN' : 'RED')
    .setFooter({text: 'You can spin Loot Mania every-day!'});

export default async function spinWheel(interaction: CommandInteraction) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const [user, cooldown] = await Promise.all([User.get(interaction.user), Cooldown.get(interaction.user.id)]);
    const win = await user.spinWheel();

    await interaction.reply({
      ephemeral: true,
      embeds: [createEmbed(win)],
      ...(!cooldown.voting.shouldNotify ? [createToggleNotificationButton('wheelSpin')] : []),
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({
        embeds: [warning(err.message)],
        ...(err.components != null ? {components: [new MessageActionRow().addComponents(...err.components)]} : {}),
        ephemeral: true,
      });
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
}
