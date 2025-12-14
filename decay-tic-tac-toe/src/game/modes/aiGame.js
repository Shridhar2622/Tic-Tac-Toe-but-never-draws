import gsap from "gsap";
import { checkWinner } from "../rules";

export function createAiGame({
  board,
  setBoard,
  moves,
  setMoves,
  currentPlayer,
  setCurrentPlayer,
  winner,
  setWinner,
  sounds,
  effects,
}) {
  const { xSound, oSound, popSound } = sounds;
  const { spawnParticles } = effects;

  function onMove(index) {
    if (board[index] || winner || currentPlayer === "O") return;
    executeMove(index, "X");
  }

  function makeAiMove() {
     // AI Logic
     const bestMove = getBestMove(board, moves, "O");
     if (bestMove !== -1) {
         executeMove(bestMove, "O");
     }
  }

  function executeMove(index, player) {
    const newBoard = [...board];
    const newMoves = [...moves];

    newBoard[index] = player;
    newMoves.push({ index, player });

    const moveSound = player === "X" ? xSound : oSound;
    moveSound.currentTime = 0;
    moveSound.play();

    // 1. Prepare Next State Logic
    let finalBoard = [...newBoard];
    let finalMoves = [...newMoves];
    let decayedPieceIndex = null;
    let isDecaying = false;

    // Check decay
    if (finalMoves.length > 6) {
        isDecaying = true;
        const oldestMove = finalMoves[0];
        decayedPieceIndex = oldestMove.index;
        
        finalBoard[decayedPieceIndex] = null;
        finalMoves.shift();
    }

    // 2. Check Win on FINAL board
    const w = checkWinner(finalBoard);

    // 3. Commit State
    const commitState = () => {
         setWinner(w);
         setBoard(finalBoard);
         setMoves(finalMoves);
         if (!w) {
             setCurrentPlayer(player === "X" ? "O" : "X");
         }
    };

    if (isDecaying) {
        const cell = document.querySelector(`.cell[data-index="${decayedPieceIndex}"]`);
        const symbol = cell?.querySelector(".symbol");

        if (symbol) {
             gsap.to(symbol, {
                 scale: 1.4, opacity: 0, duration: 0.2, ease: "power2.in",
                 onComplete: () => {
                     if (popSound) { popSound.currentTime = 0; popSound.play(); }
                     if (spawnParticles) spawnParticles(cell, "explode");
                     commitState();
                 }
             });
        } else {
             commitState();
        }
    } else {
         commitState();
    }
  }

  function commitDecay(currentMoves, currentBoard, player) {
       // Perform the removal
       const finalMoves = [...currentMoves];
       const finalBoard = [...currentBoard];
       
       const removed = finalMoves.shift();
       finalBoard[removed.index] = null;

       setBoard(finalBoard);
       setMoves(finalMoves);
       setCurrentPlayer(player === "X" ? "O" : "X");
  }

  return { onMove, makeAiMove };
}

// --- MINIMAX AI ---

function getBestMove(board, moves, player) {
    let bestScore = -Infinity;
    let move = -1;
    const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

    // Heuristic: If center is free, take it (unless win imminent)
    if (availableMoves.includes(4)) {
       // return 4; // Too simple? Let minimax decide.
    }

    /* 
       Decay adds complexity. 
       State: Board + Moves List.
    */

    for (let i of availableMoves) {
        // Simulate move
        const { nextBoard, nextMoves } = simulateState(board, moves, i, player);
        const score = minimax(nextBoard, nextMoves, 0, false);
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }
    return move;
}

const SCORES = {
  O: 10,
  X: -10,
  TIE: 0
};

function minimax(board, moves, depth, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === "O") return SCORES.O - depth; // Prefer fast win
    if (winner === "X") return SCORES.X + depth; // Prefer slow loss
    if (depth >= 6) return 0; // Depth Limit for performance

    const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (availableMoves.length === 0) return 0; // Should not happen with decay logic usually, but treating as tie/end of search

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i of availableMoves) {
            const { nextBoard, nextMoves } = simulateState(board, moves, i, "O");
            const score = minimax(nextBoard, nextMoves, depth + 1, false);
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i of availableMoves) {
            const { nextBoard, nextMoves } = simulateState(board, moves, i, "X");
            const score = minimax(nextBoard, nextMoves, depth + 1, true);
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function simulateState(board, moves, index, player) {
    const newBoard = [...board];
    const newMoves = moves.map(m => ({...m})); 
    
    newBoard[index] = player;
    newMoves.push({ index, player });

    // Enforce Rule: Decay happens BEFORE checking win.
    if (newMoves.length > 6) {
        const removed = newMoves.shift();
        newBoard[removed.index] = null;
    }

    // Now check win (implicitly handled by the caller examining newBoard)
    return { nextBoard: newBoard, nextMoves: newMoves };
}
