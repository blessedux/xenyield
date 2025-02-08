"use client"

import { useState } from "react"
import { useGame } from "../context/GameContext"
import WalletConnection from "./WalletConnection"
import GameStats from "./GameStats"

export default function MainMenu() {
  const { contract } = useGame()
  const [gameState, setGameState] = useState<"menu" | "connecting" | "stats">("menu")

  const handleStartGame = () => {
    if (contract) {
      setGameState("stats")
    } else {
      setGameState("connecting")
    }
  }

  if (gameState === "connecting") {
    return <WalletConnection onConnected={() => setGameState("stats")} />
  }

  if (gameState === "stats") {
    return <GameStats />
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-8 retro-text">Main Menu</h2>
      <button className="retro-button mb-4" onClick={handleStartGame}>
        Start Game
      </button>
      <button className="retro-button mb-4">How to Play</button>
      <button className="retro-button">Exit</button>
    </div>
  )
}

