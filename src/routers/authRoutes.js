const { register, login } = require("../controllers/auth.controllers");

module.exports = function authRoutes(router) {
  router.post("/api/register", register);
  router.post("/api/login", login);
};
