import {MessageButton} from 'discord.js';

export default class ResponseError extends Error {
  components: [MessageButton];

  constructor(message: string, components?: [MessageButton]) {
    super(message);
    this.name = 'ResponseError';
    this.components = components;
  }
}
