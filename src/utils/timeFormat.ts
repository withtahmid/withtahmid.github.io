export function formatTimestamp(timestamp: number) {
  const dateTime = new Date(timestamp);

  const padZero = (num: number) => String(num).padStart(2, '0');

  const day = padZero(dateTime.getDate());
  const month = padZero(dateTime.getMonth() + 1);
  const year = dateTime.getFullYear().toString().slice(2);

  let hours = dateTime.getHours();
  const minutes = padZero(dateTime.getMinutes());
  const seconds = padZero(dateTime.getSeconds());

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const date = `${day}/${month}/${year}`;
  const time = `${padZero(hours)}:${minutes}:${seconds} ${ampm}`;

  return { date, time };
}