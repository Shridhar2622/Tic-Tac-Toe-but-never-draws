import { useEffect, useState } from "react";

export default function GlitchText({ text }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        // Random glitch trigger
        if (Math.random() > 0.7) {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <h1 
        style={{ 
            fontSize: "4rem", 
            fontWeight: "bold", 
            letterSpacing: "4px",
            position: "relative",
            color: "#fff",
            textShadow: glitch ? "2px 0 red, -2px 0 blue" : "none"
        }}
      >
        {text}
      </h1>
      {glitch && (
          <>
            <span style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                color: "#fff",
                clipPath: "inset(0 0 60% 0)",
                transform: "translate(-2px, 0)",
                opacity: 0.7
            }}>{text}</span>
            <span style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                color: "#fff",
                clipPath: "inset(60% 0 0 0)",
                transform: "translate(2px, 0)",
                opacity: 0.7
            }}>{text}</span>
          </>
      )}
    </div>
  );
}
