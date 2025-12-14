import gsap from "gsap";
import { checkWinner } from "../rules";

export function createLocalGame({
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
    if (board[index] || winner) return;

    const newBoard = [...board];
    const newMoves = [...moves];

    newBoard[index] = currentPlayer;
    newMoves.push({ index, player: currentPlayer });

    const moveSound = currentPlayer === "X" ? xSound : oSound;
    moveSound.currentTime = 0;
    moveSound.play();

    // 1. Prepare Next State Logic (Don't update React state yet)
    let finalBoard = [...newBoard];
    let finalMoves = [...newMoves];
    let decayedPieceIndex = null;
    let isDecaying = false;

    // Check if we need to decay (Rule: > 6 pieces)
    if (finalMoves.length > 6) {
        isDecaying = true;
        const oldestMove = finalMoves[0]; // Logic: Oldest move (index 0)
        decayedPieceIndex = oldestMove.index;
        
        // Apply Decay to the "Logical" board immediately for Win Check
        finalBoard[decayedPieceIndex] = null;
        finalMoves.shift();
    }

    // 2. Check Win on the FINAL board (Post-Decay)
    // This ensures a piece that is about to pop does NOT count for a win.
    const w = checkWinner(finalBoard);

    // 3. Handle Animation & State Updates
    const commitState = () => {
        setWinner(w);
        setBoard(finalBoard);
        setMoves(finalMoves);
        if (!w) {
            setCurrentPlayer(p => (p === "X" ? "O" : "X"));
        }
    };

    if (isDecaying) {
        // Animate the decay
        const cell = document.querySelector(`.cell[data-index="${decayedPieceIndex}"]`);
        const symbol = cell?.querySelector(".symbol");

        if (symbol) {
            gsap.to(symbol, {
                scale: 1.4,
                opacity: 0,
                duration: 0.2, // Fast decay
                ease: "power2.in",
                onComplete: () => {
                    popSound.currentTime = 0;
                    popSound.play();
                    spawnParticles(cell, "explode");
                    
                    // Commit state only after animation to prevent visual glitch
                    commitState();
                },
            });
        } else {
            // Fallback if symbol missing
            commitState(); 
        }
    } else {
        // No decay, immediate commit
        commitState();
    }
  }

  return { onMove };
}
