import AudioPlayerMui from "./AudioPlayerMui.jsx";


export default function Sequencer({ audioFile, bpm }) {
    console.log("audioFile:", audioFile, "bpm:", bpm);
    if (!audioFile || !bpm) return null;

    return (
    <div>
        <AudioPlayerMui audioFile={audioFile}/>
    </div>
  );
}
