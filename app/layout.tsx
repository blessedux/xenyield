import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";


export const metadata: Metadata = {
  title: "XenoYield",
  description: "A blockchain-based space exploration game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}