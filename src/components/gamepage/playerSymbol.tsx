import React from "react";

type PlayerSymbolProps = {
    name: string;
}

function PlayerSymbol({ name }: PlayerSymbolProps): JSX.Element {
  return (
    <div className="player-symbol">
      <div className="player-symbol-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="90"
          fill="currentColor"
          className="bi bi-person-fill player-symbol-icon"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
        <div className="player-symbol-name">{name}</div>
      </div>
    </div>
  );
}

export default PlayerSymbol;
