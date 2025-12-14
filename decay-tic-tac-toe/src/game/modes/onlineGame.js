import { io } from "socket.io-client";
import gsap from "gsap";

let socket;
function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");
  }
  return socket;
}

export function createOnlineGame({ effects, roomId, myIdentity, socket }) {
  // const socket = getSocket(); // ❌ Don't create new one
  if (!socket) console.error("Socket not passed to createOnlineGame");

  const { spawnParticles } = effects || {};

  function onMove(index) {
    if (!roomId) return;
    socket.emit("make-move", { roomId, index });
  }

  function createRoom() {
    socket.emit("create-room", { hostName: myIdentity });
  }

  function joinRoom(id) {
    socket.emit("join-room", { roomId: id, playerName: myIdentity });
  }

  return {
    onMove,
    createRoom,
    joinRoom,
    socket,
    spawnParticles
  };
}

export function setupOnlineListeners(socket, config) {
  const { setBoard, setMoves, setCurrentPlayer, setWinner, setRoomId, sounds, effects, setPlayerNames } = config;
  const { xSound, oSound, popSound } = sounds || {};
  const { spawnParticles } = effects || {};



  function handleRoomUpdated(room) {
    console.log("Room Updated/Joined:", room.id);
    if (setRoomId) setRoomId(room.id);
    setBoard(room.board);
    setMoves(room.moves);
    setCurrentPlayer(room.currentPlayer);
    setWinner(room.winner);
    if (setPlayerNames && room.names) setPlayerNames(room.names);
  }

  function handleGameUpdate(room) {
    setBoard(prevBoard => {
      const newBoard = room.board;
      
      // 1. Detect added moves (Play Sound)
      newBoard.forEach((cell, i) => {
        if (cell && !prevBoard[i]) {
           if (cell === "X" && xSound) {
               xSound.currentTime = 0;
               xSound.play();
           } else if (cell === "O" && oSound) {
               oSound.currentTime = 0;
               oSound.play();
           }
        }
      });

      // 2. Detect removed moves (Decay Animation + Pop + Particles)
      prevBoard.forEach((cell, i) => {
        if (cell && !newBoard[i]) {
            // Decay happened at index i
            const cellEl = document.querySelector(`.cell[data-index="${i}"]`);
            if (cellEl && popSound && spawnParticles) {
                 popSound.currentTime = 0;
                 popSound.play();
                 
                 // Spawn particles
                 spawnParticles(cellEl, "explode");
                 
                 // Note: We can't easily do the GSAP scale down animation here because the state update happens immediately.
                 // The piece will vanish.
                 // To match localGame perfect animation, we would need to Delay the state update?
                 // But multiple updates might queue.
                 // For now, particles + sound is good enough feedback.
            }
        }
      });

      return newBoard;
    });

    setMoves(room.moves);
    setCurrentPlayer(room.currentPlayer);
    setWinner(room.winner);
  }
  
  function handleError(msg) {
      console.error("Socket Error:", msg);
      alert(msg);
  }

  function handleRoomCreated(room) {
    console.log("✅ Socket: room-created received", room);
    if (setRoomId) setRoomId(room.id);
    else console.error("setRoomId is missing!");
    
    setBoard(room.board);
    setMoves(room.moves);
    setCurrentPlayer(room.currentPlayer);
    setWinner(room.winner);
    if (setPlayerNames && room.names) setPlayerNames(room.names);
  }

  // ... (rest of handlers)

  console.log("Setting up online listeners for socket", socket.id);
  socket.on("room-created", handleRoomCreated);
  socket.on("room-updated", handleRoomUpdated);
  socket.on("game-update", handleGameUpdate);
  socket.on("error", handleError);

  return () => {
    console.log("Cleaning up online listeners");
    socket.off("room-created", handleRoomCreated);
    socket.off("room-updated", handleRoomUpdated);
    socket.off("game-update", handleGameUpdate);
    socket.off("error", handleError);
  };
}
