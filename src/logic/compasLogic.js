export function calcularCantidadCompases(duracion, bpm, beatsPorCompas = 4) {
  if (!duracion || !bpm) return 0;
  const compasDuration = (60 / bpm) * beatsPorCompas;
  return Math.floor(duracion / compasDuration);
}
