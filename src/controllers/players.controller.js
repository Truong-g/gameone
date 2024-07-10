const db = require("../configs/database");

const createPlayer = async (ctx) => {
  try {
    const { username } = ctx.request.body;

    const [existsUser] = await db.execute(
      `
              SELECT * FROM players WHERE username = ?
              `,
      [username]
    );
    if (existsUser.length) {
      ctx.status = 400;
      ctx.body = { message: "Username đã tồn tại" };
      return;
    }
    await db.execute(
      `
            INSERT INTO players (username) VALUES (?)
            `,
      [username]
    );
    const [rows] = await db.execute(
      `
            SELECT * FROM players WHERE username = ?
            `,
      [username]
    );

    ctx.body = rows[[0]];
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  createPlayer,
};
