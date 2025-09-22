export default function formatDuration(value) {
  if (!value && value !== 0) return "0:00";
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}
