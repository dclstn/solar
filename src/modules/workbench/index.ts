import {CommandInteraction, MessageEmbed} from 'discord.js';
import {ApplicationCommandTypes} from 'discord.js/typings/enums';
import moment from 'moment';
import {CommandNames, CommandDescriptions, CommandOptions, WorkBenchSubCommandNames} from '../../constants.js';
import commands from '../../interactions/commands.js';
import WorkBench from '../../database/workbench/index.js';
import {RECIPES} from '../../utils/recipes.js';
import type {BenchInterface} from '../../types/bench.js';
import ResponseError from '../../utils/error.js';
import {warning} from '../../utils/embed.js';
import Sentry from '../../sentry.js';
import redlock, {userLock} from '../../redis/locks.js';
import {capitalizeFirstLetter} from '../../utils/index.js';

function createEmbed(workBench: BenchInterface, interaction) {
  const {tasks} = workBench;

  const embed = new MessageEmbed()
    .setColor('PURPLE')
    .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()});

  if (tasks.length === 0) {
    embed.setDescription('You have no on-going tasks, `/workbench craft` to get started!');
  }

  for (const task of tasks) {
    const recipe = RECIPES[task.recipeId];
    // const item = Items[recipe.reward];

    const minsLeft = moment(task.endDate).diff(new Date(), 'minutes');

    embed.addField(
      `Crafting ${capitalizeFirstLetter(recipe.name)}`,
      `${capitalizeFirstLetter(moment.duration(minsLeft, 'minutes').humanize())} remaining`
    );
  }

  embed.setFooter({text: "Task's are checked on intervals of every minute"});

  return embed;
}

async function handleCraftInteraction(interaction: CommandInteraction) {
  const lock = await redlock.acquire([userLock(interaction.user)], 1000);
  const recipeId = interaction.options.getString('recipe');

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
    case WorkBenchSubCommandNames.CRAFT:
      handleCraftInteraction(interaction);
      break;
    case WorkBenchSubCommandNames.HOME:
      handleHomeInteraction(interaction);
      break;
    default:
      break;
  }
});

commands.registerCommand({
  type: ApplicationCommandTypes.CHAT_INPUT,
  name: CommandNames.WORKBENCH,
  description: CommandDescriptions[CommandNames.WORKBENCH],
  options: CommandOptions[CommandNames.WORKBENCH],
});
