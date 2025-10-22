export const formatTime = (time: Date | number) => {
  time = new Date(time);
  const year = time.getFullYear();
  const [ month, date ] = [time.getMonth() + 1, time.getDate()].map(n => n < 10 ? `0${n}` : n);
  return `${year}-${month}-${date}`
}
