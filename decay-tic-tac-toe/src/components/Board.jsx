import Cell from "./Cell";

export default function Board({ board, onMove, spawnParticles }) {
  return (
    <div className="board">
      {board.map((value, i) => (
        <Cell
          key={i}
          index={i}
          value={value}
          onClick={() => onMove(i)}
          spawnParticles={spawnParticles}
        />
      ))}
    </div>
  );
}
