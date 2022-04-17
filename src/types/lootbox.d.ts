import Mongoose from 'mongoose';

export interface LootboxInterface extends Mongoose.Document {
  discordId: Mongoose.Schema.Types.Long;
  totalUnboxed: number;
}

export interface LootboxModelInterface extends Mongoose.Model<LootboxInterface> {
  get(user: Mongoose.Schema.Types.Long | string): Promise<LootboxInterface>;
}
