const wsError = require("../events/wsError");
const wsMultiCustom = require("../events/wsMultiCustom");

module.exports = function (wss, ws, roomName) {
  if (!wss.rooms) {
    wsError(ws, "Phòng không tồn tại");
    return;
  }
  const roomIndex = wss.rooms.findIndex((_room) => _room.roomName === roomName);
  if (roomIndex < 0) {
    wsError(ws, "Phòng không tồn tại");
    return;
  }
  const newRooms = [...wss.rooms];
  newRooms[roomIndex].members.push(ws.clientId);
  wss.rooms = newRooms;
  wsMultiCustom(
    "join-room-success",
    newRooms[roomIndex].members,
    "Tham gia phòng thành công",
    newRooms[roomIndex]
  );
};
