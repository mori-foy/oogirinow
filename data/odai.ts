export const odaiList: string[] = [
  "こんな上司は嫌だ",
];

export function getTodayOdai(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dayIndex = Math.floor(jst.getTime() / 86400000);
  return odaiList[dayIndex % odaiList.length];
}
