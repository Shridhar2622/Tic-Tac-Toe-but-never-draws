import { useState } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import Welcome from "./components/Welcome";
import "./styles/board.css";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [view, setView] = useState("home"); // "home" | "game"
  const [mode, setMode] = useState("local"); // "local" | "ai" | "online"
  const [matchNames, setMatchNames] = useState({ X: "Player X", O: "Player O" }); // Names for the current match

  if (!playerName) {
      return <Welcome onComplete={setPlayerName} />;
  }

  function startGame(selectedMode, customNames = null) {
    setMode(selectedMode);
    
    // Determine names based on mode
    if (selectedMode === "ai") {
        setMatchNames({ X: playerName, O: "Computer" });
    } else if (selectedMode === "local") {
        // If custom names passed (from offline modal), use them. Else default.
        setMatchNames(customNames || { X: "Player 1", O: "Player 2" });
    } else {
        // Online: X is self (temporarily), will update when room joined/created
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
        <Home onStart={startGame} playerName={playerName} />
      ) : (
        <Game 
            mode={mode} 
            onBack={goHome} 
            playerNames={matchNames} 
            setPlayerNames={setMatchNames} // Game might update names (Online)
            myIdentity={playerName}
        />
      )}
    </div>
  );
}
