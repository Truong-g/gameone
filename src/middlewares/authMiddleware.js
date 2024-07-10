const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  const token = ctx.headers.authorization;

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header is missing" };
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    console.log(error);
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
};
