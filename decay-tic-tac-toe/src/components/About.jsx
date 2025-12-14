import React from "react";
import Globe from "./react-bits/Globe";
import "../Styles/about.css";

const About = ({ onBack }) => {
  return (
    <div className="about-container">
      <header className="about-header">
        <button onClick={onBack} className="back-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Game
        </button>
      </header>

      <main className="about-content">
        <div className="text-section">
          <h1 className="main-title">Decay Tic-Tac-Toe</h1>
          
          <div className="description-card">
            <p className="highlight-text">
              "This isn’t the Tic-Tac-Toe you grew up with. In this version, the
              board forgets — old moves fade away as new ones appear. Wins are
              earned by timing and strategy, not waiting for mistakes. No draws.
              No stalling. Just constant motion."
            </p>
            <p className="dev-note">
              Built for those who refuse to settle for a draw. A game of memory, speed, and decay.
            </p>
            <p className="dev-note" style={{ marginTop: '0.5rem', color: '#646cff' }}>
               — Shridhar Pandey (Developer)
            </p>
          </div>

          <div className="social-links">
            <a
              href="https://instagram.com/shridharr0_o"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/shridhar-pandey-089a39285/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://github.com/Shridhar2622"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="globe-section">
          <Globe className="" />
        </div>
      </main>
    </div>
  );
};

export default About;
