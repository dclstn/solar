import {ButtonInteraction} from 'discord.js';
import {MessageComponentIds} from '../../constants.js';
import components from '../../interactions/components.js';
import Cooldown from '../../database/cooldown/index.js';
import {success} from '../../utils/embed.js';

const VALID_TYPES = ['wheelSpin', 'voting'];
const isValidType = (type: string) => VALID_TYPES.includes(type);

components.on(MessageComponentIds.TOGGLE_NOTIFICATION, async (interaction: ButtonInteraction, type: string) => {
  if (!isValidType(type)) {
    return;
  }

  const cooldown = await Cooldown.findOne({discordId: interaction.user.id});

  if (cooldown == null) {
    return;
  }

  const toggled = cooldown[type].shouldNotify;
  cooldown.set(`${type}.shouldNotify`, !toggled);

  await cooldown.save();

  await interaction.reply({
    embeds: [success(cooldown[type].shouldNotify ? 'You will now be notified!' : 'You will no longer be notified!')],
  });
});
