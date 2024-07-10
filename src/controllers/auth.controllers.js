require("dotenv").config();
const db = require("../configs/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (ctx) => {
  try {
    const { fullName, userName, email, roleId, avatar, password } =
      ctx.request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [roles] = await db.execute(`SELECT * FROM role WHERE id = ?`, [
      roleId,
    ]);
    if (roles.length) {
      await db.execute(
        `INSERT INTO users (fullName, userName, email, roleId, avatar, password)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          fullName || null,
          userName,
          email || null,
          roleId || null,
          avatar || null,
          hashedPassword,
        ]
      );
      ctx.body = {
        fullName,
        userName,
        email,
        roleId,
        avatar,
      };
    } else {
      throw new Error("error not exists");
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
};

const login = async (ctx) => {
  const { userName, password } = ctx.request.body;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE userName = ?", [
      userName,
    ]);
    if (rows.length === 0) {
      ctx.status = 400;
      ctx.body = {
        error: "Tài khoản hoặc mật khẩu không đúng",
      };
      return;
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 400;
      ctx.body = {
        error: "Tài khoản hoặc mật khẩu không đúng",
      };
      return;
    }
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    ctx.body = { accessToken };
  } catch (error) {
    ctx.throw(500, error.message);
  }
};

module.exports = {
  register,
  login,
};
