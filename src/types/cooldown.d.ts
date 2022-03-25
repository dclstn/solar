import {User} from 'discord.js';
import Mongoose from 'mongoose';
import {VotingInterface} from './vote';

export interface CoolDownsInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  wheelSpin: {
    notified: boolean;
    shouldNotify: boolean;
    endDate: Date;
  };
  voting: {
    notified: boolean;
    shouldNotify: boolean;
    endDate: Date;
    meta: VotingInterface;
  };
}

export interface CoolDownModelInterface extends Mongoose.Model<CoolDownsInterface> {
  get(user: Mongoose.Schema.Types.Long | string): Promise<CoolDownsInterface>;
}
