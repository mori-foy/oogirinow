import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    // 15:00 JST (06:00 UTC) にお題を生成する
    { path: "/api/cron/generate-odai", schedule: "0 6 * * *" },
  ],
};
