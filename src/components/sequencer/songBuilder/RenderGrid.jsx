import { validateRowCol, createGrid, mapGrid } from "../../../logic/gridLogic.jsx";
import { useState } from "react";

export default function RenderGrid({ type, row = 8, col = 8 }) {

  const [grid, setGrid] = useState(() => createGrid(row, col));
  
  validateRowCol(row, col);
  return <div>{mapGrid(grid, type, setGrid)}</div>;

}
