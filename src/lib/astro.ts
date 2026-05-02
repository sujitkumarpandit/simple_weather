/**
 * Astro utilities for weather app
 */

export function getMoonPhase(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    // year--;
    // month += 12;
    // We adjust local vars instead of params
  }
  
  const y = month < 3 ? year - 1 : year;
  const m = month < 3 ? month + 12 : month;

  const a = Math.floor(y / 100);
  const aa = 2 - a + Math.floor(a / 4);
  jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + aa - 1524.5;
  
  const daysSinceNew = jd - 2451549.5;
  const newMoons = daysSinceNew / 29.53;
  const phase = newMoons - Math.floor(newMoons);
  
  // 0 or 1 is New Moon
  // 0.25 is First Quarter
  // 0.5 is Full Moon
  // 0.75 is Last Quarter
  
  if (phase < 0.06) return { name: 'New Moon', icon: '🌑' };
  if (phase < 0.19) return { name: 'Waxing Crescent', icon: '🌒' };
  if (phase < 0.31) return { name: 'First Quarter', icon: '🌓' };
  if (phase < 0.44) return { name: 'Waxing Gibbous', icon: '🌔' };
  if (phase < 0.56) return { name: 'Full Moon', icon: '🌕' };
  if (phase < 0.69) return { name: 'Waning Gibbous', icon: '🌖' };
  if (phase < 0.81) return { name: 'Last Quarter', icon: '🌗' };
  if (phase < 0.94) return { name: 'Waning Crescent', icon: '🌘' };
  return { name: 'New Moon', icon: '🌑' };
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp * 1000));
}
