// Which holiday look the site wears today. The site is static, so the choice runs in the browser.
// Every look starts 3 days before the holiday and ends on its last day, then the site goes back to default.
export type Season = 'none' | 'tet' | 'noel' | 'newyear' | 'hungvuong' | 'thongnhat' | 'thieunhi' | 'quockhanh' | 'trungthu' | 'nhagiao';

export const SEASONS: Season[] = ['none', 'tet', 'noel', 'newyear', 'hungvuong', 'thongnhat', 'thieunhi', 'quockhanh', 'trungthu', 'nhagiao'];

// Solar holidays repeat every year: [season, from MM-DD, to MM-DD] (inclusive; newyear wraps past 31/12).
export const FIXED: [Season, string, string][] = [
  ['noel', '12-21', '12-25'], // Giáng sinh 24–25/12
  ['newyear', '12-29', '01-01'], // Tết Dương lịch 1/1
  ['thongnhat', '04-27', '05-01'], // 30/4 và 1/5
  ['thieunhi', '05-29', '06-01'], // Quốc tế Thiếu nhi 1/6
  ['quockhanh', '08-30', '09-02'], // Quốc khánh 2/9
  ['nhagiao', '11-17', '11-20'], // Nhà giáo Việt Nam 20/11
];

// --- Vietnamese lunar calendar (Hồ Ngọc Đức's algorithm, UTC+7) ---
const TZ = 7;
const jdFromDate = (dd: number, mm: number, yy: number) => {
  const a = Math.floor((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
  return dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};
const jdToIso = (jd: number) => {
  const a = jd + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor((b * 146097) / 4);
  const d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor((1461 * d) / 4), m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1, month = m + 3 - 12 * Math.floor(m / 10), year = b * 100 + d - 4800 + Math.floor(m / 10);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
const newMoonDay = (k: number) => {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180, sin = Math.sin;
  let jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3 + 0.00033 * sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mp = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let c = (0.1734 - 0.000393 * T) * sin(M * dr) + 0.0021 * sin(2 * dr * M);
  c -= 0.4068 * sin(Mp * dr) + 0.0161 * sin(dr * 2 * Mp) + 0.0004 * sin(dr * 3 * Mp);
  c += 0.0104 * sin(dr * 2 * F) - 0.0051 * sin(dr * (M + Mp));
  c -= 0.0074 * sin(dr * (M - Mp)) + 0.0004 * sin(dr * (2 * F + M));
  c -= 0.0004 * sin(dr * (2 * F - M)) - 0.0006 * sin(dr * (2 * F + Mp));
  c += 0.001 * sin(dr * (2 * F - Mp)) + 0.0005 * sin(dr * (2 * Mp + M));
  const dt = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  jd += c - dt;
  return Math.floor(jd + 0.5 + TZ / 24);
};
const sunSector = (jdn: number) => {
  const T = (jdn - 0.5 - TZ / 24 - 2451545) / 36525, T2 = T * T, dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor((L / Math.PI) * 6);
};
const month11 = (yy: number) => {
  const k = Math.floor((jdFromDate(31, 12, yy) - 2415021) / 29.530588853);
  const nm = newMoonDay(k);
  return sunSector(nm) >= 9 ? newMoonDay(k - 1) : nm;
};
const leapOffset = (a11: number) => {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let i = 1, arc = sunSector(newMoonDay(k + 1)), last;
  do { last = arc; i++; arc = sunSector(newMoonDay(k + i)); } while (arc !== last && i < 14);
  return i - 1;
};
// Julian day of a (non-leap) lunar date.
const lunarJd = (day: number, month: number, year: number) => {
  const a11 = month < 11 ? month11(year - 1) : month11(year), b11 = month < 11 ? month11(year) : month11(year + 1);
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365 && off >= leapOffset(a11)) off += 1;
  return newMoonDay(k + off) + day - 1;
};
/** Solar date (YYYY-MM-DD) of a lunar date, optionally shifted by `shift` days. */
export const lunarToIso = (day: number, month: number, year: number, shift = 0) => jdToIso(lunarJd(day, month, year) + shift);

// Lunar holidays: [season, from YYYY-MM-DD, to YYYY-MM-DD], computed at build time.
// shortcut: covers the build year −1 to +10; a deploy at least once a decade keeps it current.
const BUILD_YEAR = new Date().getFullYear();
export const LUNAR: [Season, string, string][] = [];
for (let y = BUILD_YEAR - 1; y <= BUILD_YEAR + 10; y++) {
  LUNAR.push(['tet', lunarToIso(1, 1, y, -3), lunarToIso(3, 1, y)]); // mùng 1 → mùng 3 Tết
  LUNAR.push(['hungvuong', lunarToIso(10, 3, y, -3), lunarToIso(10, 3, y)]); // Giỗ Tổ 10/3
  LUNAR.push(['trungthu', lunarToIso(15, 8, y, -3), lunarToIso(15, 8, y)]); // rằm tháng Tám
}

// Self-check against published calendar dates; a wrong port fails the build instead of shipping wrong holidays.
for (const [got, want] of [
  [lunarToIso(1, 1, 2024), '2024-02-10'], [lunarToIso(1, 1, 2025), '2025-01-29'], [lunarToIso(1, 1, 2026), '2026-02-17'],
  [lunarToIso(1, 1, 2027), '2027-02-06'], [lunarToIso(1, 1, 2028), '2028-01-26'], [lunarToIso(1, 1, 2033), '2033-01-31'],
  [lunarToIso(10, 3, 2025), '2025-04-07'], [lunarToIso(10, 3, 2026), '2026-04-26'], [lunarToIso(15, 8, 2025), '2025-10-06'],
  [lunarToIso(15, 8, 2026), '2026-09-25'], [lunarToIso(15, 8, 2028), '2028-10-03'],
]) if (got !== want) throw new Error(`season.ts lunar calendar: expected ${want}, got ${got}`);

const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
/** Name of the lunar year that starts at Tết of `year`, e.g. 2026 → "Bính Ngọ". */
export const canChi = (year: number) => `${CAN[year % 10]} ${CHI[year % 12]}`;
