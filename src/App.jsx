import { useState } from 'react'
import './App.css'
import AudioUploader from './components/AudioUploader.jsx'
import BpmInput from './components/BpmInput.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'

function App() {

  const [audioFile, setAudioFile] = useState('public/assets/Coldplay-yellow.mp3')
  const [bpm, setBpm] = useState('')

  return (
    <main>
      <AudioUploader onFileChange = {setAudioFile} />
      <BpmInput onBpmChange = {setBpm}/>
      <div>
        <p>Archivo seleccionado: {audioFile ? audioFile.name : 'Ninguno'}</p>
        <p>BPM: {bpm}</p>
      </div>
      <AudioPlayer audioFile = {audioFile}/>

    </main>
  )
}

export default App
