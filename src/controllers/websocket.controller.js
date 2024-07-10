const { wss } = require("../websocket");
const db = require("../configs/database");

const getRooms = async (ctx) => {
  try {
    if (!wss.rooms) {
      ctx.body = [];
      return;
    }
    ctx.body = wss.rooms;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

const getClientWs = async (ctx) => {
  try {
    const clients = Array.from(wss.clients).map((client) => {
      return client.clientId
    });
    ctx.body = clients;
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  getRooms,
  getClientWs,
};
