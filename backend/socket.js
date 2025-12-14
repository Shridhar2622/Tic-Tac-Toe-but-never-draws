    const { Server } = require("socket.io");
const gameManager = require("./game/gameManager");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    console.log("🟢 Player connected:", socket.id);

    socket.on("create-room", ({ hostName }) => {
      console.log("Create Room request from", socket.id, "Host:", hostName);
      const room = gameManager.createRoom(socket.id, hostName);
      socket.join(room.id);
      socket.emit("room-created", room);
    });

    socket.on("join-room", ({ roomId, playerName }) => {
      console.log("Join Room request:", roomId, "Player:", playerName);
      const room = gameManager.joinRoom(roomId, socket.id, playerName);

      if (!room) {
        socket.emit("error", "Room not found or full");
        return;
      }

      socket.join(room.id);
      io.to(room.id).emit("room-updated", room);
      io.to(room.id).emit("game-update", room); // Send initial state with names
    });

    socket.on("make-move", ({ roomId, index }) => {
      const result = gameManager.makeMove(roomId, socket.id, index);
      if (!result) return;

      io.to(roomId).emit("game-update", result);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Player disconnected:", socket.id);
      gameManager.handleDisconnect(socket.id);
    });
  });
}

module.exports = setupSocket;
