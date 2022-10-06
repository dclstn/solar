import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log('Connected to Mongoose');

export default mongoose.createConnection(process.env.MONGO_URI);
