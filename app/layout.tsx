import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GameProvider } from "@/context/GameContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XenoYield",
  description: "A blockchain-based space exploration game",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
} 