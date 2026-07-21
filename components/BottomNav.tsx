"use client";

import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    label: "みんなの投稿",
    href: "/feed",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 13.2c2.4.3 4 2.4 4 5.8" />
      </svg>
    ),
  },
  {
    label: "回答する",
    href: "/",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7-3-3-7 7v3h3z" />
        <path d="M16 5l3 3" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
  {
    label: "プロフィール",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-[#D4C9B8]">
      <div className="max-w-md mx-auto flex items-end justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ label, href, icon }) => {
          const active = pathname === href;
          const isCenter = href === "/";

          if (isCenter) {
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-1.5 -translate-y-3"
              >
                <span
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2C6142] transition-all duration-100 shadow-[0_4px_0_#1F4630,0_6px_8px_rgba(0,0,0,0.25)] active:translate-y-[3px] active:shadow-[0_1px_0_#1F4630,0_2px_4px_rgba(0,0,0,0.2)]"
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-full text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                    style={{
                      background: "linear-gradient(180deg, #4B9A6C 0%, #3A7D55 100%)",
                    }}
                  >
                    {icon(true)}
                  </span>
                </span>
                <span
                  className={`text-[10px] font-medium leading-none ${
                    active ? "text-[#3A7D55]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                active ? "text-[#3A7D55]" : "text-gray-400"
              }`}
            >
              {icon(active)}
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
