import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Providers } from '@/providers/Providers'

export const metadata: Metadata = {
  title: "XenYield",
  description: "DeFi based Space Exploration",
  icons: {
    icon: "/favicon.ico", // Path to your favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-black min-h-screen text-white antialiased">
        <Providers>
          <GameProvider>
            {children}
          </GameProvider>
        </Providers>
      </body>
    </html>
  );
}