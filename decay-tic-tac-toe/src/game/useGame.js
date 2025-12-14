import { useMemo, useEffect, useRef } from "react";
import { createLocalGame } from "./modes/localGame";
import { createOnlineGame, setupOnlineListeners } from "./modes/onlineGame";
import { createAiGame } from "./modes/aiGame";
import { io } from "socket.io-client";

export function useGame(mode, config) {
  const { 
    board, setBoard, moves, setMoves, currentPlayer, setCurrentPlayer,
    winner, setWinner, sounds, effects, roomId, setRoomId,
    setPlayerNames, myIdentity 
  } = config;

  const socket = useMemo(() => (mode === "online" ? io("http://localhost:4000") : null), [mode]);

  useEffect(() => {
    if (mode === "online" && socket) {
      const cleanup = setupOnlineListeners(socket, config);
      return () => {
        cleanup();
        socket.disconnect();
      };
    }
  }, [mode, socket, config]);

  const game = useMemo(() => {
    if (mode === "local") {
      return createLocalGame(config);
    }
    if (mode === "ai") {
      return createAiGame(config);
    }
    if (mode === "online") {
      // Pass myIdentity for name syncing AND the socket
      return createOnlineGame({ effects, roomId, myIdentity, socket });
    }
    return {};
  }, [mode, config, roomId, myIdentity, effects]);

  // Handle AI Turn Effect
  useEffect(() => {
    if (mode === "ai" && config.currentPlayer === "O" && !config.winner && game.makeAiMove) {
      const timer = setTimeout(() => {
        game.makeAiMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [mode, config.currentPlayer, config.winner, game]);

  return game;
}
