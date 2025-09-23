const row = 8;
const col = 8;

const createGrid = () =>
  Array.from({ length: row }, () => Array.from({ length: col }, () => false));
const grid = createGrid();

const sectionColors = {
  INTRO: "#e0bbff",
  ESTRIBILLO: "#6ccdf3ff",
  VERSO: "#cc62d8ff",
  PUENTE: "#ffbbbc",
  // etc.
};

export default function RenderGrid({ color }) {
  const mapGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: "flex" }}>
        {row.map((cell, columIndex) => (
          <div
            key={columIndex}
            style={{
              width: "20px",
              height: "20px",
              border: "1px solid black",
              backgroundColor: cell ? "black" : sectionColors[color] || "white",
            }}
          ></div>
        ))}
      </div>
    ));
  };

  return <div>{mapGrid()}</div>;
}
