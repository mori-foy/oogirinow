export type Season = "spring" | "summer" | "autumn" | "winter";

export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

const basePrompt =
  "あなたは大喜利の「お題」を1つ作る作家です。日本語で、短く(20〜40文字程度)、誰でも答えやすい大喜利のお題を1つだけ出力してください。前置きや説明、記号での装飾は不要で、お題の文章だけを出力してください。";

export const seasonPrompts: Record<Season, string> = {
  spring: `${basePrompt} 季節は春です。お花見、入学・入社、花粉症、卒業など春らしい話題を1つ絡めてください。`,
  summer: `${basePrompt} 季節は夏です。暑さ、夏休み、花火、海、部活の合宿など夏らしい話題を1つ絡めてください。`,
  autumn: `${basePrompt} 季節は秋です。食欲、紅葉、運動会、文化祭など秋らしい話題を1つ絡めてください。`,
  winter: `${basePrompt} 季節は冬です。忘年会、正月、クリスマス、寒さ、受験など冬らしい話題を1つ絡めてください。`,
};

export function getTodaySeasonPrompt(date = new Date()): string {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return seasonPrompts[getSeason(jst.getUTCMonth() + 1)];
}
