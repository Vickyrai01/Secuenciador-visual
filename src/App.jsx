import { useState } from 'react'
//import { calculateCompas } from 'logic/compasLogic.js'
import './App.css'
import AudioPlayer from './components/AudioPlayer.jsx'
import AudioBpmForm from './components/AudioBpmForm.jsx'
import AudioBpmInfo from './components/AudioBpmInfo.jsx'

function App() {

  const [audioFile, setAudioFile] = useState(null)
  const [bpm, setBpm] = useState('')
  //const [audioDuration, setAudioDuration] = useState(null);
  //const [compassCount, setCompassCount] = useState(null);
 
  const handleFormSubmit = (file, bpmValue) => {
    setAudioFile(file)
    setBpm(bpmValue)
  }

  return (
    <main>
      <h1>Secuenciador Visual</h1>
      <h2>Selecciona archivo y Bpm deseado</h2>
      <AudioBpmForm onSubmit={handleFormSubmit} />
      <AudioBpmInfo audioFile={audioFile} bpm={bpm}/>
      <AudioPlayer audioFile={audioFile} />

    </main>
    
  )
}

export default App
