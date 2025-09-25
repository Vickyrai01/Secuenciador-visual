import { useState } from "react";

export default function SongBuilderForm({ onSubmit }) {
  const [row, setRow] = useState("");
  const [col, setCol] = useState("");
  const [type, setType] = useState("INTRO");

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(row, col, type);
  };

  return (
    <form onSubmit={handleLocalSubmit}>
      <h3>Crear nuevo grid</h3>
      <label>
        Filas:
        <input
          type="number"
          value={row}
          min={1}
          onChange={(e) => setRow(Number(e.target.value))}
          placeholder="Filas"
        />
      </label>
      <label>
        Columnas:
        <input
          type="number"
          value={col}
          min={1}
          onChange={(e) => setCol(Number(e.target.value))}
          placeholder="Columnas"
        />
      </label>
      <label>
        Tipo:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="INTRO">INTRO</option>
          <option value="ESTRIBILLO">ESTRIBILLO</option>
          <option value="VERSO">VERSO</option>
          <option value="PUENTE">PUENTE</option>
        </select>
      </label>
      <button type="submit">Agregar sección</button>
    </form>
  );
}