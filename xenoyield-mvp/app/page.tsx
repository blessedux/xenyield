import { Suspense } from "react"
import { GameProvider } from "../context/GameContext"
import MainMenu from "../components/MainMenu"

export default function Home() {
  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
        <div className="retro-screen w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center retro-text">XENOYIELD</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <MainMenu />
          </Suspense>
        </div>
      </main>
    </GameProvider>
  )
}

