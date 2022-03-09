# Castle-Mania

[![Build Status](https://github.com/dclstn/castle-mania/actions/workflows/node.js.yml/badge.svg)](https://github.com/dclstn/castle-mania/actions/workflows/node.js.yml) [![Discord](https://img.shields.io/discord/757291484298084452?color=%237289DA&label=discord)](https://discord.gg/3Jee9Re)

How to contribute:

1. Fork this repository & clone it
2. Run `npm install` to install all the dependencies
3. Setup enviroment variables (you will need to host a local mongodb server)

   - `touch .env`
   - `echo MONGO_URI=mongodb://127.0.0.1:27017/castlemania >> .env`
   - `echo ENVIROMENT=development >> .env`
   - `echo SENTRY_DSN=https://3af7d4198553496c92cb577bc2f4d6fc@o1095587.ingest.sentry.io/6115320 >> .env`

4. Setup a discord bot for development https://discord.com/developers/applications

   - `echo DISCORD_TOKEN=[YOUR DISCORD TOKEN] >> .env`

5. Get the ID of the server you plan to develop in

   - `echo GUILD_ID=[YOUR DEVELOPMENT GUILD ID] >> .env`

6. Setup a redis-server

   - `npm i -g redis-server`
   - `redis-server`

7. Startup the bot `npm run bot -- --reloadApplicationCommands`
