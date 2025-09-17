import { useState } from 'react'
import './App.css'
import AudioUploader from './components/AudioUploader.jsx'
import BpmInput from './components/BpmInput.jsx'

function App() {

  const [audioFile, setAudioFile] = useState(null)
  const [bpm, setBpm] = useState('')

  return (
    <main>
      <AudioUploader onFileChange = {setAudioFile} />
      <BpmInput onBpmChange = {setBpm}/>
      <div>
        <p>Archivo seleccionado: {audioFile ? audioFile.name : 'Ninguno'}</p>
        <p>BPM: {bpm}</p>
      </div>
    </main>
  )
}

export default App
