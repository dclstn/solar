import Client from 'ioredis';

export default new Client(process.env.REDIS_URL);
