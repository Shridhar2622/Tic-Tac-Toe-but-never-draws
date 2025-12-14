const WIN_PATTERNS = require("./winPattern");

const rooms = {};

function createRoom(hostId, hostName) {
  const roomId = Math.random().toString(36).slice(2, 7);

  rooms[roomId] = {
    id: roomId,
    players: [hostId],
    names: { X: hostName || "Player X", O: null },
    board: Array(9).fill(null),
    currentPlayer: "X",
    moves: [],
    winner: null,
  };

  return rooms[roomId];
}

function joinRoom(roomId, playerId, playerName) {
  const room = rooms[roomId];
  if (!room || room.players.length >= 2) return null;

  room.players.push(playerId);
  room.names.O = playerName || "Player O";
  return room;
}

function makeMove(roomId, playerId, index) {
  const room = rooms[roomId];
  if (!room || room.winner) return null;

  const playerIndex = room.players.indexOf(playerId);
  if (playerIndex === -1) return null;

  const symbol = playerIndex === 0 ? "X" : "O";
  if (room.currentPlayer !== symbol) return null;
  if (room.board[index]) return null;

  room.board[index] = symbol;
  room.moves.push(index);

  // 1. Determine Decay Logic FIRST
  let isDecaying = false;
  let decayedIndex = -1;

  if (room.moves.length > 6) {
      isDecaying = true;
      decayedIndex = room.moves[0]; // Get the index of the piece to remove
      room.moves.shift();           // Remove from moves list
      room.board[decayedIndex] = null; // Remove from board logic
  }

  // 2. Check Winner on Final Board State
  checkWinner(room);
  
  // 3. Update Turn
  if (!room.winner) {
      room.currentPlayer = symbol === "X" ? "O" : "X";
  }

  return room;
}

function checkWinner(room) {
  for (let [a, b, c] of WIN_PATTERNS) {
    if (
      room.board[a] &&
      room.board[a] === room.board[b] &&
      room.board[a] === room.board[c]
    ) {
      room.winner = room.board[a];
    }
  }
}

function handleDisconnect(playerId) {
  for (let roomId in rooms) {
    const room = rooms[roomId];
    if (room.players.includes(playerId)) {
      delete rooms[roomId];
    }
  }
}

module.exports = {
  createRoom,
  joinRoom,
  makeMove,
  handleDisconnect,
};
