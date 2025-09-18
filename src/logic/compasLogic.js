export function calculateCompas(bpm, audioDuration , beatsByCompas = 4) {
  if (!bpm || !audioDuration ) return { quantity: 0, compasDuration: 0 }
  const compasDuration = (60 / bpm) * beatsByCompas
  const quantity = Math.floor(audioDuration  / compasDuration)
  return { quantity, compasDuration }
}