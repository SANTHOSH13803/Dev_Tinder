const { Server } = require("socket.io");
const ChatModel = require("../models/chat");
const MessageModel = require("../models/messages");

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
    socket.on("joinChat", ({ chatId }) => {
      socket.join(chatId);
    });
    socket.on("sendMessage", async ({ text, chatId, userId }) => {
      try {
        const roomId = chatId;
        // creating new message with chatid
        let messages = new MessageModel({
          chatId,
          senderId: userId,
          message: text
        });
        const response = await messages.save();

        // updating lastMessage in chat

        await ChatModel.findOneAndUpdate(
          { _id: chatId },
          { lastMessage: text }
        );

        io.to(roomId).emit("messageReceived", { message: response });
      } catch (error) {
        console.log(error.message);
      }
    });
    socket.on("register-user", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit("user-online", { userId });
    });
    socket.on("typing", ({ userId, chatId }) => {
      socket.to(chatId).emit("typing", {
        userId: socket.userId
      });
    });
    socket.on("stop-typing", ({ userId, chatId }) => {
      socket.to(chatId).emit("stop-typing", {
        userId: socket.userId
      });
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
