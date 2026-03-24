import AudioPlayerMui from "./AudioPlayerMui.jsx";
import SongBuilder from "./songBuilder/SongBuilder.jsx";

export default function Sequencer({ audioFile, bpm }) {
  if (!audioFile || !bpm) return null;

  return (
    <div>
      <AudioPlayerMui audioFile={audioFile} />
      <SongBuilder/>
    </div>
  );
}
