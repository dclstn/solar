import {User} from 'discord.js';
import Mongoose from 'mongoose';
import type {UserInterface} from './user';

export interface RaidInterface extends Mongoose.Document {
  isRaidable: boolean;
  canRaid: boolean;
  discordId: Mongoose.Schema.Types.Long;
  lastRaid: Date;
  lastRaided: Date;
}

export interface RaidResultInterface {
  raiders: (UserInterface & {
    _id: string;
  })[];
  target: UserInterface;
  success: boolean;
  stolen?: number;
  split?: number;
}

export interface RaidCreateInterface {
  user: User;
  target: User;
  onComplete?: (raidMeta: RaidResultInterface) => void;
}

export interface RaidModelInterface extends Mongoose.Model<RaidInterface> {
  get(user: Mongoose.Schema.Types.Long | string): Promise<RaidInterface>;
  createRaid(meta: RaidCreateInterface): Promise<string>;
  joinRaid(sessionId, user: User);
  leaveRaid(sessionId, user: User);
}
