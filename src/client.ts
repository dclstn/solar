import {Client, Intents} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.login(process.env.DISCORD_TOKEN);

export default client;
