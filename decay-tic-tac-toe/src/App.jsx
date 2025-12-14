import { useState, useMemo, useEffect } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import Welcome from "./components/Welcome";
import { createSounds } from "./game/sounds";
import "./styles/board.css";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [view, setView] = useState("home"); // "home" | "game"
  const [mode, setMode] = useState("local"); // "local" | "ai" | "online"
  const [matchNames, setMatchNames] = useState({ X: "Player X", O: "Player O" }); 
  const [musicEnabled, setMusicEnabled] = useState(true); 

  // 🎵 Global Sound Manager
  const sounds = useMemo(() => createSounds(), []);

  // Handle Autoplay Policy
  useEffect(() => {
    const unlockAudio = () => {
      if (musicEnabled && sounds.music.paused) {
        sounds.music.play().catch(e => console.log("Audio unlock failed", e));
      }
      // Remove listener after first interaction
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [musicEnabled, sounds]);

  useEffect(() => {
    if (musicEnabled) {
        const playPromise = sounds.music.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log("Autoplay prevented. Waiting for interaction.");
                // We don't force it here, the interaction listener will catch it.
            });
        }
    } else {
        sounds.music.pause();
    }
  }, [musicEnabled, sounds]);

  if (!playerName) {
      return (
        <>
            <Welcome onComplete={setPlayerName} />
            {/* Show Audio Toggle even on Welcome */}
            <button 
                onClick={() => setMusicEnabled(!musicEnabled)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 9999,
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "50px",
                    cursor: "pointer",
                    padding: "10px 15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease"
                }}
            >
                {musicEnabled ? (
                    <>
                        <img width="20" height="20" src="https://img.icons8.com/ios/50/high-volume--v1.png" alt="Music On" style={{ filter: "invert(1)" }} />
                        <span>Music On</span>
                    </>
                ) : (
                    <>
                        <img width="20" height="20" src="https://img.icons8.com/ios/50/mute--v1.png" alt="Music Off" style={{ filter: "invert(0.5)" }} />
                        <span style={{ color: "#aaa" }}>Music Off</span>
                    </>
                )}
            </button>
        </>
      );
  }

  function startGame(selectedMode, customNames = null) {
    setMode(selectedMode);
    
    // Determine names based on mode
    if (selectedMode === "ai") {
        setMatchNames({ X: playerName, O: "Computer" });
    } else if (selectedMode === "local") {
        setMatchNames(customNames || { X: "Player 1", O: "Player 2" });
    } else {
        setMatchNames({ X: playerName, O: "Waiting..." });
    }

    setView("game");
  }

  function goHome() {
    setView("home");
    setMode("local");
  }

  return (
    <div className="app">
      {view === "home" ? (
        <Home 
            onStart={startGame} 
            playerName={playerName} 
        />
      ) : (
        <Game 
            mode={mode} 
            onBack={goHome} 
            playerNames={matchNames} 
            setPlayerNames={setMatchNames} 
            myIdentity={playerName}
            sounds={sounds}
        />
      )}

      {/* 🎵 Persistent Global Audio Toggle */}
      <button 
        onClick={() => setMusicEnabled(!musicEnabled)}
        style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50px",
            cursor: "pointer",
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {musicEnabled ? (
            <>
                <img width="20" height="20" src="https://img.icons8.com/ios/50/high-volume--v1.png" alt="Music On" style={{ filter: "invert(1)" }} />
                <span>Music On</span>
            </>
        ) : (
            <>
                <img width="20" height="20" src="https://img.icons8.com/ios/50/mute--v1.png" alt="Music Off" style={{ filter: "invert(0.5)" }} />
                <span style={{ color: "#aaa" }}>Music Off</span>
            </>
        )}
      </button>
    </div>
  );
}
