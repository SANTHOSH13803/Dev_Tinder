const { Server } = require("socket.io");
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL
    }
  });

  io.on("connection", (socket) => {
    // ... code goes here
    socket.on("joinChat", ({ userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("$");
    });
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
