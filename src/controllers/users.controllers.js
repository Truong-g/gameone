const db = require("../configs/database");
const { hideFields } = require("../utils");
const getProfile = async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const [rows] = await db.execute(
      `
            SELECT * FROM users WHERE id = ?
            `,
      [userId]
    );
    ctx.body = hideFields(rows, ["password", "roleId"])[0];
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  getProfile,
};
