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

  // Check Winner FIRST (Before Decay) (Win Priority)
  checkWinner(room);
  
  // If winner, do NOT decay. The game ends with the extra piece.
  if (room.winner) {
      room.currentPlayer = symbol === "X" ? "O" : "X"; // Switch turn (doesn't matter much)
      return room;
  }

  // If NO winner, THEN apply Decay Logic
  if (room.moves.length > 6) {
    const removedIndex = room.moves.shift();
    room.board[removedIndex] = null;
  }

  room.currentPlayer = symbol === "X" ? "O" : "X";

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
