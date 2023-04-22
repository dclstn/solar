import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log('Connected to Mongoose');

const connectionpOptions = {
    dbName: "solar",
    useNewParser: true,
    useUnifiedTopology: true,
};

export default mongoose.createConnection(process.env.MONGO_URI, connectionpOptions);
