"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OdaiPanel from "@/components/OdaiPanel";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/lib/firestore";
import { getTodayOdai } from "@/data/odai";

function detectInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Line\/|Instagram|FBAN|FBAV|Twitter|Snapchat/i.test(ua)) return true;
  if (/iPhone|iPad|iPod/.test(ua) && !/Safari/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua)) return true;
  if (/Android/.test(ua) && /wv/.test(ua)) return true;
  return false;
}

export default function HomePage() {
  const router = useRouter();
  const { isExpired, hasPosted, setPosted } = useAppStore();
  const { user, loading, signInWithGoogle } = useAuth();

  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const odai = getTodayOdai();
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInAppBrowser(detectInAppBrowser());
  }, []);

  const isValid = answer.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || isExpired || !user) return;
    setSubmitting(true);
    try {
      await createPost(
        user.uid,
        user.displayName ?? "名無し",
        user.photoURL ?? "",
        [answer.trim()],
        "senryu",
        false,
        null
      );
      setPosted();
      router.push("/feed");
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </main>
    );
  }

  if (!user) {
    const handleCopyUrl = async () => {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto">
        <Image
          src="/logo_oogirinow.png"
          alt="大喜利なう。"
          width={240}
          height={80}
          className="mx-auto mb-10"
          priority
        />
        {inAppBrowser ? (
          <>
            <div className="w-full max-w-xs bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6 text-center">
              <p className="text-amber-800 text-sm font-bold mb-2">
                アプリ内ブラウザでは<br />Googleログインができません
              </p>
              <p className="text-amber-700 text-xs">
                SafariまたはChromeで開いてください
              </p>
            </div>
            <button
              onClick={handleCopyUrl}
              className="w-full max-w-xs py-4 rounded-2xl text-base font-bold bg-[#3A7D55] text-white shadow-lg active:scale-95 transition-all duration-200"
              style={{ fontFamily: "var(--font-kaisei)" }}
            >
              {copied ? "コピーしました！" : "URLをコピーする"}
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">
              コピーしたURLをSafariのアドレスバーに貼り付けて開いてください
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-8 text-sm text-center">
              今日の一句を詠むには<br />ログインしてください
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full max-w-xs py-4 rounded-2xl text-base font-bold bg-[#3A7D55] text-white shadow-lg active:scale-95 transition-all duration-200"
              style={{ fontFamily: "var(--font-kaisei)" }}
            >
              Googleでログイン
            </button>
          </>
        )}
      </main>
    );
  }

  if (isExpired && !hasPosted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-6xl mb-4">⏰</p>
          <h1
            className="text-2xl font-bold text-[#1A1A1A] mb-2"
            style={{ fontFamily: "var(--font-kaisei)" }}
          >
            今日の句は終わりました
          </h1>
          <p className="text-gray-500">また明日、川柳を詠んでください。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-4 pt-8 pb-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <Image
          src="/logo_oogirinow.png"
          alt="大喜利なう。"
          width={240}
          height={80}
          className="mx-auto"
          priority
        />
      </div>

      {/* Odai + timer */}
      <OdaiPanel odai={odai} />

      {/* Answer */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="アンサーを入力してください"
        rows={4}
        className="w-full p-4 rounded-2xl border border-[#D4C9B8] bg-white/70 text-[#1A1A1A] text-base placeholder:text-gray-300 focus:outline-none focus:border-[#3A7D55] resize-none"
        style={{ fontFamily: "var(--font-kaisei)" }}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isExpired || submitting}
        className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 mt-3 ${
          isValid && !isExpired
            ? "bg-[#3A7D55] text-white shadow-lg active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        style={{ fontFamily: "var(--font-kaisei)" }}
      >
        {submitting ? "投稿しています..." : "回答する"}
      </button>
    </main>
  );
}
