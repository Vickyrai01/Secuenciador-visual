import { useState } from "react";
import "./App.css";
import AudioBpmForm from "./components/AudioBpmForm.jsx";
import Sequencer from "./components/sequencer/Sequencer.jsx";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [bpm, setBpm] = useState("");

  const handleFormSubmit = (file, bpmValue) => {
    setAudioFile(file);
    setBpm(bpmValue);
  };

  return (
    <main>
      <h1>Secuenciador Visual</h1>
      <AudioBpmForm onSubmit={handleFormSubmit} />
      <Sequencer audioFile={audioFile} bpm={bpm} />
    </main>
  );
}

export default App;
