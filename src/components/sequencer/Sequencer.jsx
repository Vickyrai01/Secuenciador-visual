import AudioPlayer from "./AudioPlayer";

export default function Sequencer({ audioFile, bpm }) {

    if (!audioFile || !bpm) return null;
    return (
    <div>
      <AudioPlayer audioFile={audioFile} />
    </div>
  );
}
