import {REST} from '@discordjs/rest';
import * as dotenv from 'dotenv';

dotenv.config();

export default new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
