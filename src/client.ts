import {Client, IntentsBitField} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages] });

client.login(process.env.DISCORD_TOKEN);

export default client;
