export function handlePlay(audioRef){
    if(audioRef.current){
        audioRef.current.play()
    }
} 
export function handlePause(audioRef){
    if(audioRef.current){
        audioRef.current.pause()
    }
}

export function audioDuration(audioFile) {
    if (!audioFile) return 0;

}

