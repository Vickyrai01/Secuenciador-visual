import { useEffect } from "react";
import { calcularCantidadCompases } from "../logic/compasLogic.js";
import { useAudioDuration } from "../hooks/useAudioDuration.js";

// Componente desacoplado, solo muestra resultados
export default function CompasCalculator({
  audioFile,
  bpm,
  beatsPerCompas = 4,
  setAudioDuration,
}) {
  const { duration, audioRef } = useAudioDuration(audioFile);
  const compasCount = calcularCantidadCompases(duration, bpm, beatsPerCompas);

  // Permite tanto File como string (ruta)
  const audioSrc =
    audioFile instanceof File ? URL.createObjectURL(audioFile) : audioFile;

  useEffect(() => {
    if (duration !== null && setAudioDuration) {
      setAudioDuration(duration);
    }
  }, [duration, setAudioDuration]);
  return (
    <section>
      {/* Audio oculto para poder leer duración */}
      <audio ref={audioRef} src={audioSrc} style={{ display: "none" }} />
      {duration && (
        <div>
          <p>Duración en segundos: {duration.toFixed(2)}</p>
          <p>
            Cantidad de compases ({beatsPerCompas} beats/compás): {compasCount}
          </p>
        </div>
      )}
    </section>
  );
}
