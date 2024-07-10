module.exports = function (ws, message) {
  ws.send(
    JSON.stringify({
      type: "error",
      message,
      timestamp: Date.now()
    })
  );
};
