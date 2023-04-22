import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log('Connected to Mongoose');

const connectionpOptions = {
  dbName: 'solar',
  useUnifiedTopology: true,
};

export default mongoose.createConnection(process.env.MONGO_URI, connectionpOptions);
