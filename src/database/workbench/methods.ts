/* eslint-disable no-continue */
import moment from 'moment';
import ResponseError from '../../utils/error.js';
import type {BenchInterface, RecipeInterface} from '../../types/bench.js';
import User from '../user/index.js';
import {RECIPES} from '../../utils/recipes.js';
import {Items} from '../../utils/items.js';
import {warning} from '../../utils/embed.js';

export async function addTask(recipe) {
  const user = await User.findOne({discordId: this.discordId});

  if (this.tasks.length >= this.maxTasks) {
    throw new ResponseError('No available task slots');
  }

  if (!recipe.requirements.every((requirement) => user.has(Items[requirement]))) {
    throw new ResponseError('You do not meet the requirements to craft this');
  }

  await user.save();

  this.tasks.push({
    recipeId: recipe.name,
    endDate: recipe.calcETA(),
  });
}

export async function checkTasks(this: BenchInterface) {
  const user = await User.findOne({discordId: this.discordId});
  const completedTasks = this.tasks.filter((recipe: RecipeInterface) => moment(recipe.endDate).isBefore(moment()));

  if (completedTasks.length === 0) return;

  for await (const [index, task] of completedTasks.entries()) {
    const recipe = RECIPES[task.recipeId];

    if (!recipe.requirements.every((requirement) => user.has(Items[requirement]))) {
      await user.notify({content: `Missing requirements for **${recipe.name}** task.`});
      this.tasks.splice(index, 1);
      continue;
    }

    for (const requirement of recipe.requirements) {
      user.rem(Items[requirement], 1);
    }

    user.add(Items[recipe.reward], 1);
    await user.notify({embeds: [warning(`Your **${recipe.name}** task has completed!`)]});
    this.tasks.splice(index, 1);
  }

  await Promise.all([this.save(), user.save()]);
}
