"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const TOTAL_SECONDS = 300;

function Pipe({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="w-4 h-full rounded-full bg-gray-100 border border-[#D4C9B8] overflow-hidden flex flex-col justify-end shrink-0">
      <div
        className="w-full transition-all duration-1000 ease-linear"
        style={{
          height: `${Math.max(0, progress * 100)}%`,
          background: `linear-gradient(180deg, ${color}cc, ${color})`,
        }}
      />
    </div>
  );
}

export default function OdaiPanel({ odai }: { odai: string }) {
  const { remainingSeconds, isExpired, tickTimer } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isExpired) return;
    intervalRef.current = setInterval(() => tickTimer(), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isExpired, tickTimer]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = remainingSeconds / TOTAL_SECONDS;

  const isUrgent = remainingSeconds <= 60 && !isExpired;
  const isCritical = remainingSeconds <= 30 && !isExpired;
  const waterColor = isCritical ? "#EF4444" : isUrgent ? "#F59E0B" : "#2C6DB5";

  return (
    <div className="mt-6 mb-4">
      {/* Signboard */}
      <div className="flex flex-col items-center">
        <div className="bg-[#5C4326] text-white rounded-lg px-5 py-1.5 shadow-md">
          <span className="font-mono font-bold text-lg tracking-widest">
            {isExpired ? "終了" : timeStr}
          </span>
        </div>
        <div className="w-1 h-3 bg-[#5C4326]" />
      </div>

      {/* Pipes + Odai box */}
      <div className="flex items-stretch gap-2">
        <Pipe progress={progress} color={waterColor} />
        <div className="flex-1 p-5 bg-white/70 rounded-2xl border border-[#D4C9B8] text-center flex flex-col justify-center">
          <p className="text-xs text-gray-400 mb-2">お題</p>
          <p
            className="text-xl text-[#1A1A1A] font-bold"
            style={{ fontFamily: "var(--font-kaisei)" }}
          >
            {odai}
          </p>
        </div>
        <Pipe progress={progress} color={waterColor} />
      </div>
    </div>
  );
}
