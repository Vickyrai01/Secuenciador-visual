import { useEffect, useRef, useState } from "react"

// Hook para obtener la duración de un archivo de audio
export function useAudioDuration(audioFile) {
  const [duration, setDuration] = useState(null)
  const audioRef = useRef()

  useEffect(() => {
    if (!audioFile) {
      setDuration(null)
      return
    }
    const audio = audioRef.current

    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("loadedmetadata", updateDuration)
    if (audio.readyState >= 1) updateDuration()

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [audioFile])

  return { duration, audioRef }
}