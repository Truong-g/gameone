const { getProfile } = require("../controllers/users.controllers");

module.exports = function (router) {
  router.get("/api/profile", getProfile);
};
