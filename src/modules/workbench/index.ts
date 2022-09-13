import {ButtonInteraction, CommandInteraction, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import moment from 'moment';
import {
  CommandNames,
  CommandDescriptions,
  CommandOptions,
  WorkBenchSubCommandNames,
  MessageComponentIds,
} from '../../lib/constants.js';
import commands from '../../interactions/commands.js';
import WorkBench from '../../database/workbench/index.js';
import {RECIPES} from '../../utils/recipes.js';
import type {BenchInterface} from '../../types/bench.js';
import ResponseError from '../../utils/error.js';
import {warning} from '../../utils/embed.js';
import Sentry from '../../lib/sentry.js';
import redlock, {userLock} from '../../redis/locks.js';
import {capitalizeFirstLetter} from '../../utils/index.js';
import {handleRecipesPage} from './recipes.js';
import components from '../../interactions/components.js';
import {emoteStrings} from '../../utils/emotes.js';
import {Items} from '../../utils/items.js';

function createEmbed(workBench: BenchInterface, interaction) {
  const {tasks} = workBench;

  const embed = new MessageEmbed()
    .setColor('PURPLE')
    .setAuthor({name: `${interaction.user.username}'s Workbench`, iconURL: interaction.user.avatarURL()});

  if (tasks.length === 0) {
    embed.setDescription('You have no on-going tasks, `/workbench craft` to get started!');
  }

  for (const task of tasks) {
    const recipe = RECIPES[task.recipeId];
    const item = Items[recipe.reward];

    const minsLeft = moment(task.endDate).diff(new Date(), 'minutes');

    embed.addField(
      `Crafting ${capitalizeFirstLetter(recipe.name)}`,
      `${capitalizeFirstLetter(moment.duration(minsLeft, 'minutes').humanize())} remaining`,
      true
    );

    embed.addField(
      'Recipe',
      `${recipe.requirements.map((itemId) => Items[itemId].emoji).join(' ')} ${emoteStrings.right} ${item.emoji}`,
      true
    );

    embed.addField('Finish time', `<t:${moment(task.endDate).unix()}>`, true);
  }

  embed.setFooter({
    text: "Your craft will fail if it doesn't meet the requirements on completion!",
  });

  return embed;
}

async function handleCraftInteraction(interaction: CommandInteraction | ButtonInteraction, recipeId) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);

  try {
    const workBench = await WorkBench.get(interaction.user);
    await workBench.addTask(RECIPES[recipeId]);

    await workBench.save();

    await interaction.reply({
      embeds: [createEmbed(workBench, interaction)],
    });
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

async function handleHomeInteraction(interaction: CommandInteraction) {
  try {
    const workBench = await WorkBench.get(interaction.user);
    await workBench.checkTasks();

    await interaction.reply({
      embeds: [createEmbed(workBench, interaction)],
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      interaction.reply({embeds: [warning(err.message)], ephemeral: true});
      return;
    }

    Sentry.captureException(err);
  }
}

commands.on(CommandNames.WORKBENCH, async (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case WorkBenchSubCommandNames.CRAFT: {
      const recipeId = interaction.options.getString('recipe');
      handleCraftInteraction(interaction, recipeId);
      break;
    }
    case WorkBenchSubCommandNames.HOME:
      handleHomeInteraction(interaction);
      break;
    case WorkBenchSubCommandNames.RECIPES:
      handleRecipesPage(interaction);
      break;
    default:
      break;
  }
});

components.on(MessageComponentIds.CRAFT, (interaction: ButtonInteraction, recipeId) => {
  handleCraftInteraction(interaction, recipeId);
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.WORKBENCH,
  description: CommandDescriptions[CommandNames.WORKBENCH],
  options: CommandOptions[CommandNames.WORKBENCH],
});
