
export function createGrid(row, col) {
  return Array.from({ length: row }, () => Array.from({ length: col }, () => false));
}

export function validateRowCol(row, col) {
  if (row < 1 || col < 1) {
    throw new Error("Invalid row or column");
  }
}

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

export function mapGrid({grid, type}, setGrid) {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: "flex" }}>
        {row.map((cell, columIndex) => (
          <div
            key={columIndex}
            style={{
              width: "20px",
              height: "20px",
              border: "1px solid black",
              backgroundColor: cell ? sectionColorsDark[type] : sectionColors[type] || "white",
            }}
            onClick={() => handleCellClick(rowIndex, columIndex, setGrid)}
          ></div>
        ))}
      </div>
    ));
}

function toggleCell(grid, rowIndex, colIndex){
  const newGrid = grid.map((row, rIdx) =>
    row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
  );
  return newGrid;
}

function handleCellClick(rowIndex, colIndex, setGrid) {
  setGrid((prevGrid) => toggleCell(prevGrid, rowIndex, colIndex));
}

