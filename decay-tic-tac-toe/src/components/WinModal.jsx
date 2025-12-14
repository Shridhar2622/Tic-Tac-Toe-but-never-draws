import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function WinModal({ winner, onReplay, onExit, onMinimize }) {
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
    <div 
      className="overlay" 
      onClick={(e) => {
        // Only trigger if clicking the overlay itself, not the modal content
        if (e.target.className === "overlay") {
             onMinimize();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="win-modal" ref={modalRef} style={{ cursor: "default" }}>
        <h2>{winner} won the game 🎉</h2>

        <div className="win-actions">
          <button className="replay-btn" onClick={onReplay} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 auto" }}>
            <img width="20" height="20" src="https://img.icons8.com/ios/50/repeat.png" alt="repeat" />
            Play Again
          </button>

          <button className="exit-btn" onClick={onExit}>
            ⬅️ Exit Game
          </button>
        </div>
        
        <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.8rem" }}>
            (Click background to inspect board)
        </p>
      </div>
    </div>
  );
}
