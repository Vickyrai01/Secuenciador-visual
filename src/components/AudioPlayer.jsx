import { useRef } from "react"
import { handlePause, handlePlay } from "../logic/playerLogic"

export default function AudioPlayer({audioFile}){
    const audioRef = useRef(null)
    if (!audioFile) return null

    const audioUrl =  URL.createObjectURL(audioFile);

    return (
        <div>
            <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
            <button onClick={() => handlePlay(audioRef)}>Reproducir</button>
            <button onClick={() => handlePause(audioRef)}>Pausar</button>    
        </div>
    )
}