import type {FastifyRequest, FastifyReply} from 'fastify';
import {TopCPHUserModel, TopUserMoneyModel} from '../../database/user/aggregation-models.js';
import Guild from '../../database/guild/index.js';
import type {UserInterface} from '../../types/user.js';
import {InventoryType} from '../../utils/enums.js';

const types = {
  CPH: 'cph',
  MONEY: 'money',
};

interface LeaderboardQuery {
  type: string;
  guildId: string;
}

export default (fastify, opts, done) => {
  fastify.get('/api/leaderboards', async (request: FastifyRequest, response: FastifyReply) => {
    const {type, guildId} = request.query as LeaderboardQuery;

    if (guildId == null) {
      let users = null;
      switch (type) {
        case types.MONEY:
          users = await TopUserMoneyModel.find({}).lean().limit(10);
          break;
        case types.CPH:
        default:
          users = await TopCPHUserModel.find({}).lean().limit(10);
          break;
      }

      response.send({users});
      return;
    }

    const guild = await Guild.findOne({_id: guildId}).populate('users');

    let users = null;
    switch (type) {
      case types.MONEY:
        users = guild.users
          .sort((a: UserInterface, b: UserInterface) => b.money - a.money)
          .map((user: UserInterface) => ({
            discordId: user.discordId.toString(),
            username: user.username,
            avatar: user.avatar,
            money: user.money,
          }))
          .slice(0, 10);
        break;
      case types.CPH:
      default:
        users = guild.users
          .sort(
            (a: UserInterface, b: UserInterface) =>
              b.getInventory(InventoryType.Main).cph - a.getInventory(InventoryType.Main).cph
          )
          .map((user: UserInterface) => ({
            discordId: user.discordId.toString(),
            username: user.username,
            avatar: user.avatar,
            cph: user.getInventory(InventoryType.Main).cph,
          }))
          .slice(0, 10);
        break;
    }

    response.send({users});
  });

  done();
};
