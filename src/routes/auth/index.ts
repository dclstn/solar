import oauth2 from 'fastify-oauth2';
import dotenv from 'dotenv';
import axios from 'axios';
import fastifyJWT from 'fastify-jwt';
import App from '../../server.js';

dotenv.config();

App.register(oauth2, {
  name: 'discordOAuth2',
  credentials: {
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: oauth2.DISCORD_CONFIGURATION,
  },
  scope: ['identify'],
  startRedirectPath: '/auth/discord',
  callbackUri: 'http://localhost:3000/discord/callback',
});

App.get('/auth/discord/callback', async (request, response) => {
  // @ts-ignore
  const token = await App.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  const res = await axios.get('https://discord.com/api/users/@me', {
    responseType: 'json',
    headers: {
      authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const {id} = res.data;
  const jwtToken = App.jwt.sign({id});

  response.send({
    token: jwtToken,
  });
});

App.register(fastifyJWT, {secret: process.env.JWT_SECRET});

App.decorate('authenticate', async (request) => {
  await request.jwtVerify();
});
