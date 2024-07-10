const { wss } = require("../../websocket");

module.exports = function (type, clientIds, message, data = null) {
  Array.from(wss.clients).forEach((client) => {
    if (clientIds.includes(client.clientId)) {
      client.send(
        JSON.stringify({
          type,
          message,
          data,
          timestamp: Date.now(),
        })
      );
    }
  });
};
