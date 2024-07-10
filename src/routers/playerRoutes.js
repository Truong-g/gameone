const { createPlayer } = require("../controllers/players.controller")


module.exports = function (router) {
    router.post('/api/player', createPlayer)
}
