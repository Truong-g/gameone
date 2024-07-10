const { getQuestions } = require("../controllers/questions.controllers");

module.exports = function (router) {
  router.get("/api/questions", getQuestions);
};
