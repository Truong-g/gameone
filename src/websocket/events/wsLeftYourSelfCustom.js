const { wss } = require("../../websocket");

module.exports = function (type, roomName, message, data = null, clientId) {
  const room = wss.rooms?.find((room) => room.roomName === roomName);
  if (room) {
    const clientIds = room.members.filter((id) => id !== clientId);
    console.log(clientIds);
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
  }
};