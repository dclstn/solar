import dotenv from 'dotenv';

dotenv.config();

export default function isProd() {
  return process.env.ENVIROMENT !== 'development';
}
