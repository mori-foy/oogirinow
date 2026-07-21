"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const TOTAL_SECONDS = 300;

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
  const gaugeColor = isCritical ? "#EF4444" : isUrgent ? "#F59E0B" : "#2C6DB5";

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

      {/* Odai box with clockwise-depleting gauge border */}
      <div
        className="p-[5px] rounded-2xl transition-[background] duration-1000 ease-linear"
        style={{
          background: `conic-gradient(${gaugeColor} ${progress * 360}deg, #E0DACB ${progress * 360}deg 360deg)`,
        }}
      >
        <div className="p-5 rounded-[13px] text-center flex flex-col justify-center bg-[#F5F0E8]">
          <p className="text-xs text-gray-400 mb-2">お題</p>
          <p
            className="text-xl text-[#1A1A1A] font-bold"
            style={{ fontFamily: "var(--font-kaisei)" }}
          >
            {odai}
          </p>
        </div>
      </div>
    </div>
  );
}
