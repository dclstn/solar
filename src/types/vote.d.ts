import Mongoose from 'mongoose';

export interface ProviderInterface {
  hasVoted: boolean;
  lastVoted: Date;
}

export interface VotingInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  topGG: ProviderInterface;
  discordBotList: ProviderInterface;
  lastReward: Date;
  rewardable: boolean;
  addVote(providerId): Promise<void>;
  validateVotes(): Promise<void>;
}

export interface VotingModelInterface extends Mongoose.Model<VotingInterface> {
  get(discordId: string): Promise<VotingInterface>;
}
