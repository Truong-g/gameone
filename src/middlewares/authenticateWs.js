const db = require("../configs/database");

module.exports = async function (request, next) {
  try {
    const secWsProtocol = request.headers["sec-websocket-protocol"];
    if (!secWsProtocol) {
      next(true, null);
      return;
    }

    const splitting = secWsProtocol.split("_");
    if (splitting.length !== 2) {
      next(true, null);
      return;
    }
    const username = splitting[1];
    const [rows] = await db.execute(
      `SELECT * FROM players WHERE username = ?`,
      [username]
    );
    if (!rows.length) {
      next(true, null);
      return;
    }
    next(false, secWsProtocol);
  } catch (error) {
    next(true, null);
  }
};
