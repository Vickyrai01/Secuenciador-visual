export default function BpmInput({onBpmChange}){
    return (
        <div>
            <h2>Ingresá el BPM de la canción</h2>
            <input 
                type="number" 
                min="1" 
                max="300" 
                placeholder="87"
                onChange = {(e) => onBpmChange(e.target.value)}
            />
        </div>
    )
}