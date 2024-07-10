module.exports = function (transaction, type, ws, message, data = null) {
  ws.send(
    JSON.stringify({
      transaction: transaction,
      type: type,
      message: message,
      data,
      timestamp: Date.now(),
    })
  );
};
