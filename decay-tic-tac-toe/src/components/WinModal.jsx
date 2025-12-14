import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function WinModal({ winner, onReplay, onExit }) {
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="overlay">
      <div className="win-modal" ref={modalRef}>
        <h2>{winner} won the game 🎉</h2>

        <div className="win-actions">
          <button className="replay-btn" onClick={onReplay}>
            🔁 Play Again
          </button>

          <button className="exit-btn" onClick={onExit}>
            ⬅️ Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
