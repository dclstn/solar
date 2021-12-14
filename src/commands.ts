import {EventEmitter} from 'events';
import {Command} from 'types/command';

class Commands extends EventEmitter {
  commands: Command[];

  constructor() {
    super();
    this.commands = [];
  }

  register(command: Command) {
    this.commands.push(command);
  }
}

export default new Commands();
