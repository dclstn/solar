import type {UserInterface} from '../../types/user';
import type {GroupInterface} from '../../types/group';
import {Roles} from '../../utils/enums.js';

export function add(this: GroupInterface, user: UserInterface) {
  user.set('group', this._id);
  this.users.push({
    user: user._id,
    role: Roles.USER,
  });
}

export function rem(this: GroupInterface, remUser: UserInterface) {
  remUser.set('group', null);
  this.set(
    'users',
    this.users.filter(({user}) => !remUser._id.equals(user))
  );
}

export function getRole(this: GroupInterface, findUser: UserInterface) {
  const found = this.users.find(({user}) => findUser._id.equals(user));

  if (found == null) {
    return null;
  }

  return found.role;
}
