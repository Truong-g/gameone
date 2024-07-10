const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const initialRoutes = require("./src/routers/index");
const cors = require("@koa/cors");
const http = require("http");
const onSocketError = require("./src/exceptions/onSocketError");
const authenticateWs = require("./src/middlewares/authenticateWs");
const { wss } = require("./src/websocket");
const createRoom = require("./src/websocket/handlers/createRoom");
const joinRoom = require("./src/websocket/handlers/joinRoom");
const wsRoomCustom = require("./src/websocket/events/wsRoomCustom");
const listOfFolkSongsAndProverbs = require("./src/data/quick-guess-quick-right.json");
const { shuffleWords, generateRandomRoom } = require("./src/utils");
const wsLeftYourSelfCustom = require("./src/websocket/events/wsLeftYourSelfCustom");

const app = new Koa();
const router = initialRoutes();

//cors
app.use(cors());

// Middleware
app.use(bodyParser());

// Use the routes defined
app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());

// Create WebSocket server

function heartbeat() {
  this.isAlive = true;
}

let previousIndex = -1;

wss.on("connection", (ws, rquest, clientId) => {
  ws.clientId = clientId;
  ws.send(
    JSON.stringify({
      clientId: clientId,
      type: "connected",
      timestamp: Date.now(),
    })
  );

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case "create-room": {
        createRoom(
          wss,
          ws,
          data.payload.roomName,
          data.payload.gameName,
          data.transaction
        );
        break;
      }
      case "join-room": {
        joinRoom(wss, ws, data.payload.roomName);
        break;
      }
      case "random-first-user": {
        wsRoomCustom("random-first-user", data.room, "Success", {
          randomValue: Math.random(),
        });
        break;
      }
      case "get-question": {
        let newIndex;
        do {
          newIndex = Math.floor(
            Math.random() * listOfFolkSongsAndProverbs.length
          );
        } while (newIndex === previousIndex);
        previousIndex = newIndex; // Cập nhật lại chỉ số phần tử đã chọn trước đó
        const question = listOfFolkSongsAndProverbs[newIndex];
        const correctAnswers = question
          .split(" ")
          .map((ques) => ({ id: generateRandomRoom(), value: ques }));
        const questions = shuffleWords([...correctAnswers]);
        wsRoomCustom("get-question", data.room, "Success", {
          questions,
          correctAnswers,
          usernamePlay: data.usernamePlay,
          timeClock1: data.timeClock1,
          timeClock2: data.timeClock2,
        });
        break;
      }
      case "action-game": {
        wsLeftYourSelfCustom(
          "action-game",
          data.room,
          "success",
          data.data,
          ws.clientId
        );
        break;
      }
      default:
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.isAlive = true;
  ws.on("error", console.error);
  ws.on("pong", heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function (ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", function () {
  clearInterval(interval);
});

server.on("upgrade", function (request, socket, head) {
  socket.on("error", onSocketError);
  authenticateWs(request, function next(err, clientId) {
    if (err || !clientId) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    socket.removeListener("error", onSocketError);
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request, clientId);
    });
  });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
