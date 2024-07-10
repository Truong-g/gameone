const wsCustom = require("../events/wsCustom");
const wsError = require("../events/wsError");

module.exports = function (wss, ws, roomName, gameName, transaction) {
  const item = {
    roomName: roomName,
    host: ws.clientId,
    members: [ws.clientId],
    gameName: gameName
  };
  if (!wss.rooms) {
    wss.rooms = [item];
    wsCustom(transaction, "create-room-success", ws, "Tạo phòng thành công", item);
  } else {
    const exists = wss.rooms.some((room) => room.roomName === roomName);
    if (exists) {
      wsError(ws, "Phòng đã tồn tại");
      return;
    }
    wss.rooms.push(item);
    wsCustom(transaction, "create-room-success", ws, "Tạo phòng thành công", item);
  }
};
