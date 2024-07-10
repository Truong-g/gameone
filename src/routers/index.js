const Router = require("koa-router");
const authRoutes = require("./authRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const questionRoutes = require("./questionRoutes");
const userRoutes = require("./userRoutes");
const playerRoutes = require("./playerRoutes");
const { getRooms, getClientWs } = require("../controllers/websocket.controller");
module.exports = function initialRoutes() {
  const router = new Router();
  authRoutes(router);
  playerRoutes(router)

  router.use(authMiddleware);
  userRoutes(router);
  questionRoutes(router);
  router.get('/api/get-rooms', getRooms)
  router.get('/api/get-user-online', getClientWs)


  return router;
};
