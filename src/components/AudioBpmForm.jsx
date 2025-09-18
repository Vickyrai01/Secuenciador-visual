import { useState } from "react";
import { handleFileChange, handleBpmChange, handleSubmit } from '../logic/audioBpmHandlers'

export default function AudioBpmForm({ onSubmit }) {
  const [localFile, setLocalFile] = useState(null);
  const [localBpm, setLocalBpm] = useState("");

  return (
    <form onSubmit={e => handleSubmit(e, onSubmit, localFile, localBpm)}>
      <input type="file" accept="audio/*" onChange={e => handleFileChange(e, setLocalFile)} />
      <input
        type="number"
        placeholder="Enter BPM"
        min={1}
        max={300}
        value={localBpm}
        onChange={e => handleBpmChange(e, setLocalBpm)}
      />
      <button type="submit">Upload</button>
    </form>
  );
}