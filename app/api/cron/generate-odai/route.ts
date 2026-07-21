import { generateText } from "ai";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { todayString } from "@/lib/date";
import { getTodaySeasonPrompt } from "@/data/odaiPrompts";
import { customOdaiList } from "@/data/customOdai";

export const dynamic = "force-dynamic";

// 自分で書いたお題が混ざる確率
const CUSTOM_ODAI_CHANCE = 0.25;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const date = todayString();
  const ref = getAdminDb().collection("odai").doc(date);
  const existing = await ref.get();
  if (existing.exists) {
    return Response.json({ skipped: true, date, text: existing.data()?.text });
  }

  const useCustomList = customOdaiList.length > 0;
  const useCustom = useCustomList && Math.random() < CUSTOM_ODAI_CHANCE;

  let text: string;
  let source: "ai" | "custom";

  if (useCustom) {
    text = customOdaiList[Math.floor(Math.random() * customOdaiList.length)];
    source = "custom";
  } else {
    const result = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      prompt: getTodaySeasonPrompt(),
    });
    text = result.text.trim();
    source = "ai";
  }

  await ref.set({
    text,
    source,
    createdAt: new Date(),
  });

  return Response.json({ date, text, source });
}
