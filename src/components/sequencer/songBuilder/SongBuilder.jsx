import { useState } from 'react';
import SongBuilderForm from './SongBuilderForm.jsx';
import SectionGrid from './SectionGrid.jsx';
import { createGrid } from '../../../logic/gridLogic';

export default function SongBuilder() {
  const [gridsContainer, setGridsContainer] = useState([]);

  const handleSubmit = (row, col, type) => {
    setGridsContainer([
      ...gridsContainer,
      { initialGrid: createGrid(row, col), type }
    ]);
  };

  return (
    <div>
      <h2>Song Builder</h2>
      {console.log(gridsContainer)}
      <SongBuilderForm onSubmit={handleSubmit} />
      {gridsContainer.map(({ initialGrid, type }, idx) => (
        <SectionGrid key={idx} initialGrid={initialGrid} type={type} />
      ))}
    </div>
  );
}