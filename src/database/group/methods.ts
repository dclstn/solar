import {UserInterface} from '../user/index.js';

export function add(user: UserInterface) {
  this.users.push(user._id);
}

export function rem(user: UserInterface) {
  const index = this.users.findIndex(({_id}) => _id === user._id);
  this.users.splice(index, 1);
}
