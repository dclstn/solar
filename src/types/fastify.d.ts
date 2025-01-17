import {OAuth2Namespace} from 'fastify-oauth2';

declare module 'fastify' {
  interface FastifyRequest {
    // @ts-ignore
    user: unknown;
  }

  interface FastifyInstance {
    discordOAuth2: OAuth2Namespace;
    authenticate: (request: FastifyRequest) => void;
  }
}
