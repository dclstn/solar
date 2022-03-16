/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import {ItemIds} from './items.js';

export const RECIPE_NAMES = {
  MYSTIC: 'mystic',
  RAINBOW: 'rainbow',
};

export const RECIPES = {
  [RECIPE_NAMES.MYSTIC]: {
    name: RECIPE_NAMES.MYSTIC,
    requirements: [ItemIds.RAINBOW, ItemIds.MYTHIC],
    reward: ItemIds.MYSTIC,
    calcETA: () => moment().add(1, 'days').toDate(),
  },
  [RECIPE_NAMES.RAINBOW]: {
    name: RECIPE_NAMES.RAINBOW,
    requirements: [ItemIds.SUN, ItemIds.MOON],
    reward: ItemIds.RAINBOW,
    calcETA: () => moment().add(6, 'hours').toDate(),
  },
};
