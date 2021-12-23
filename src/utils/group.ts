import {Defaults} from '../constants.js';
import Group from '../database/group/index.js';
import {Roles} from './enums.js';
import type {UserInterface} from '../types/user.js';
import {numberWithCommas} from './embed.js';
import ResponseError from './error.js';

export function validGroupName(name: string): boolean {
  if (!/^[a-zA-Z0-9_.-]*$/.test(name)) {
    return false;
  }

  if (name.length < 3) {
    return false;
  }

  if (name.length > 12) {
    return false;
  }

  return true;
}

export async function createGroup(user: UserInterface, name: string) {
  if (user.money < Defaults.GROUP_COST) {
    throw new ResponseError(`You need ${numberWithCommas(Defaults.GROUP_COST)} gems to create a kingdom`);
  }

  if (!validGroupName(name)) {
    throw new ResponseError('Invalid name, names must be between 3 and 12 characters and contain only letters/numbers');
  }

  if (user.group != null) {
    throw new ResponseError('You must disband/leave your current kingdom before creating one');
  }

  const group = await Group.create({
    name,
    users: [
      {
        role: Roles.OWNER,
        user: user._id,
      },
    ],
  });

  user.set('group', group._id);
  user.set('money', user.money - Defaults.GROUP_COST);

  await user.save();

  return group;
}
