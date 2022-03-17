/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import {ItemIds} from './items.js';

export const RECIPES = {
  [ItemIds.RAINBOW]: {
    name: ItemIds.RAINBOW,
    requirements: [ItemIds.SUN, ItemIds.MOON],
    reward: ItemIds.RAINBOW,
    time: '6 hours',
    calcETA: () => moment().add(6, 'hours').toDate(),
  },
  [ItemIds.MYSTIC]: {
    name: ItemIds.MYSTIC,
    requirements: [ItemIds.RAINBOW, ItemIds.MYTHIC],
    reward: ItemIds.MYSTIC,
    time: '1 day',
    calcETA: () => moment().add(1, 'days').toDate(),
  },
  [ItemIds.BLUE_DIAMOND]: {
    name: ItemIds.BLUE_DIAMOND,
    requirements: [ItemIds.DIAMOND, ItemIds.MYSTIC],
    reward: ItemIds.BLUE_DIAMOND,
    time: '1 day',
    calcETA: () => moment().add(1, 'days').toDate(),
  },
  [ItemIds.RED_DIAMOND]: {
    name: ItemIds.RED_DIAMOND,
    requirements: [ItemIds.RUBY, ItemIds.MYSTIC],
    reward: ItemIds.RED_DIAMOND,
    time: '1 day',
    calcETA: () => moment().add(1, 'days').toDate(),
  },
  [ItemIds.TORTOISE]: {
    name: ItemIds.TORTOISE,
    requirements: [ItemIds.BLUE_DIAMOND, ItemIds.RED_DIAMOND],
    reward: ItemIds.TORTOISE,
    time: '2 days',
    calcETA: () => moment().add(2, 'days').toDate(),
  },
  [ItemIds.RGB]: {
    name: ItemIds.RGB,
    requirements: [ItemIds.TORTOISE, ItemIds.BLUE_DIAMOND, ItemIds.RED_DIAMOND],
    reward: ItemIds.RGB,
    time: '2 days',
    calcETA: () => moment().add(2, 'days').toDate(),
  },
  [ItemIds.BURNING]: {
    name: ItemIds.BURNING,
    requirements: [ItemIds.RGB, ItemIds.RED_DIAMOND],
    reward: ItemIds.BURNING,
    time: '3 days',
    calcETA: () => moment().add(3, 'days').toDate(),
  },
  [ItemIds.SCORCHING]: {
    name: ItemIds.SCORCHING,
    requirements: [ItemIds.RGB, ItemIds.TORTOISE],
    reward: ItemIds.SCORCHING,
    time: '3 days',
    calcETA: () => moment().add(3, 'days').toDate(),
  },
  [ItemIds.AZURE]: {
    name: ItemIds.AZURE,
    requirements: [ItemIds.RGB, ItemIds.BLUE_DIAMOND],
    reward: ItemIds.AZURE,
    time: '3 days',
    calcETA: () => moment().add(3, 'days').toDate(),
  },
  [ItemIds.OMEGA]: {
    name: ItemIds.OMEGA,
    requirements: [ItemIds.BURNING, ItemIds.SCORCHING, ItemIds.AZURE],
    reward: ItemIds.OMEGA,
    time: '7 days',
    calcETA: () => moment().add(7, 'days').toDate(),
  },
};
