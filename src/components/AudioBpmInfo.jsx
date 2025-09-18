export default function AudioBpmInfo({audioFile, bpm}){
    return (
        <div>
            <p>Archivo seleccionado: <b>{audioFile ? audioFile.name : 'Ninguno'}</b></p>
            <p>BPM: {bpm}</p>
        </div>
    )
}