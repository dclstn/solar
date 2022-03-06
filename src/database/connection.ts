import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default mongoose.createConnection(process.env.MONGO_URI);
