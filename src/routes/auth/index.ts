import oauth2 from 'fastify-oauth2';
import dotenv from 'dotenv';
import axios from 'axios';
import isProd from '../../utils/enviroment.js';
import User from '../../database/user/index.js';

dotenv.config();

export default (fastify, opts, done) => {
  fastify.register(oauth2, {
    name: 'discordOAuth2',
    credentials: {
      client: {
        id: '757120026867138580',
        secret: process.env.CLIENT_SECRET,
      },
      auth: oauth2.DISCORD_CONFIGURATION,
    },
    scope: ['identify', 'email'],
    startRedirectPath: '/auth/discord',
    callbackUri: isProd() ? 'https://castlemania.bot/discord/callback' : 'http://localhost:3000/discord/callback',
  });

  fastify.get('/auth/discord/callback', async (request, response) => {
    const token = await fastify.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const {data} = await axios.get('https://discord.com/api/users/@me', {
      responseType: 'json',
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    User.upsert(data.id, data.email, data.locale);

    const {id, username, locale} = data;
    const jwtToken = fastify.jwt.sign({
      id,
      username,
      locale,
      token,
    });

    response.send({token: jwtToken});
  });

  done();
};
