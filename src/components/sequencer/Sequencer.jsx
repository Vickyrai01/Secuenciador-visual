import AudioPlayerMui from "./AudioPlayerMui.jsx";
import RenderGrid from "./RenderGrid.jsx";

export default function Sequencer({ audioFile, bpm }) {
  if (!audioFile || !bpm) return null;

  return (
    <div>
      <AudioPlayerMui audioFile={audioFile} />
      <RenderGrid type="ESTRIBILLO" row={2} col={16} />
    </div>
  );
}
