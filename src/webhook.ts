import {WebhookClient} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export default new WebhookClient({
  url: process.env.WEBHOOK_URL,
});
