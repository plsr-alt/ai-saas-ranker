import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tools Ranking 2026 - Best AI SaaS Tools Compared by Developer Mentions",
  description: "Real-time ranking of AI tools based on developer community mentions across GitHub, Qiita, Reddit and more. Updated daily with unbiased data.",
  keywords: "AI tools, SaaS ranking, ChatGPT, Claude, Cursor, GitHub Copilot, AI comparison",
  openGraph: {
    title: "AI Tools Ranking 2026",
    description: "Developer-driven AI tools ranking updated daily",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
