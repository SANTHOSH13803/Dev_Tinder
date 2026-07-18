const { Server } = require("socket.io");
const ChatModel = require("../models/chat");

const onlineUsers = new Map();

const checkUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL
    }
  });

  io.on("connection", (socket) => {
    // ... code goes here
    socket.on("joinChat", ({ userId, toUserId, firstName }) => {
      const roomId = [userId, toUserId].sort().join("$");
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ firstName, userId, toUserId, text }) => {
      try {
        const roomId = [userId, toUserId].sort().join("$");
        let chat = await ChatModel.findOne({
          participants: { $all: [userId, toUserId] }
        });
        if (!chat) {
          chat = new ChatModel({
            participants: [userId, toUserId],
            messages: []
          });
          await chat.save();
        }
        chat.messages.push({
          message: text,
          senderId: userId
        });
        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, message: text });
      } catch (error) {
        console.log(error.message);
      }
    });
    socket.on("register-user", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit("user-online", { userId });
    });
    socket.on("disconnect", () => {
      if (!socket.userId) return;
      onlineUsers.delete(socket.userId);
      io.emit("user-offline", {
        userId: socket.userId
      });
    });
  });
};

module.exports = { initializeSocket, checkUserOnline };
