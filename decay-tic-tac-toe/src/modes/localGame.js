import gsap from "gsap";

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

    // DECAY
    if (newMoves.length > 6) {
      const removed = newMoves[0];
      const cell = document.querySelector(
        `.cell[data-index="${removed.index}"]`
      );
      const symbol = cell?.querySelector(".symbol");

      if (symbol) {
        gsap.to(symbol, {
          scale: 1.4,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            popSound.currentTime = 0;
            popSound.play();

            spawnParticles(cell, "explode");

            newMoves.shift();
            newBoard[removed.index] = null;

            setBoard([...newBoard]);
            setMoves([...newMoves]);
            setCurrentPlayer(p => (p === "X" ? "O" : "X"));
          },
        });
      }
      return;
    }

    setBoard(newBoard);
    setMoves(newMoves);
    setCurrentPlayer(p => (p === "X" ? "O" : "X"));
  }

  return { onMove };
}
    