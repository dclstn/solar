import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conn = mongoose.createConnection(process.env.MONGO_URI);

export default conn;
