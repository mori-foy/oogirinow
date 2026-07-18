import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "大喜利なう。",
  description: "1日1回、5分で川柳を詠む",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className="h-full"
    >
      <body className="min-h-full pb-16">
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
