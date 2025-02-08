import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { Providers } from '@/providers/Providers'


export const metadata: Metadata = {
  title: "XenYield",
  description: "A blockchain-based space exploration game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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