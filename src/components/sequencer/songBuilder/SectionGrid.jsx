import { useState } from "react";

const sectionColors = {
  INTRO: "#e0bbff",
  ESTRIBILLO: "#6ccdf3ff",
  VERSO: "#cc62d8ff",
  PUENTE: "#ffbbbc",
  // etc.
};

const sectionColorsDark = {
  INTRO: "#8f78a1ff",
  ESTRIBILLO: "#40778cff",
  VERSO: "#7e3d86ff",
  PUENTE: "#8a6768ff",
  // etc.
};

function toggleCell(grid, rowIndex, colIndex) {
  return grid.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === rowIndex && cIdx === colIndex ? !cell : cell
    )
  );
}

export default function SectionGrid({ initialGrid, type }) {
  const [grid, setGrid] = useState(initialGrid);

  return (
    <div style={{ margin: "1em 0"}}>
      <h4>{type}</h4>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid black",
                backgroundColor: cell
                  ? sectionColorsDark[type]
                  : sectionColors[type] || "white",
                cursor: "pointer",
              }}
              onClick={() =>
                setGrid((g) => toggleCell(g, rowIndex, colIndex))
              }
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}