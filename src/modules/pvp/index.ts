import {CommandInteraction} from 'discord.js';
import moment from 'moment';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import {success, warning} from '../../utils/embed.js';
import {CommandNames, CommandDescriptions, CommandOptions} from '../../constants.js';
import commands from '../../interactions/commands.js';
import User from '../../database/user/index.js';
import redlock, {userLock} from '../../redis/locks.js';
import ResponseError from '../../utils/error.js';
import Sentry from '../../sentry.js';
import webhook from '../../webhook.js';

const {duration} = moment;

commands.on(CommandNames.PVP, async (interaction: CommandInteraction) => {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  const boolean = interaction.options.getBoolean('enable', true);

  try {
    const user = await User.get(interaction.user);

    if (boolean === user.pvp.enabled) {
      throw new ResponseError(`You already have this ${boolean ? `enabled` : `disabled`}`);
    }

    if (!user.pvp.canDisable && !boolean) {
      const timeLeft = moment(user.pvp.updated).add(1, 'day').diff(new Date(), 'seconds');
      throw new ResponseError(`You cannot disable pvp yet, ${duration(timeLeft, 'seconds').humanize()} remaining`);
    }

    user.set('pvp.enabled', boolean);
    user.set('pvp.updated', new Date());

    await user.save();

    await Promise.all([
      interaction.reply({embeds: [success(`PVP is now ${boolean ? 'enabled' : 'disabled'}`)]}),
      webhook.send({embeds: [warning(`<@${interaction.user.id}> has ${boolean ? 'enabled' : 'disabled'} pvp`)]}),
    ]);
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  } finally {
    await lock.release();
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.PVP,
  description: CommandDescriptions[CommandNames.PVP],
  options: CommandOptions[CommandNames.PVP],
});
