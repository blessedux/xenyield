"use client"

import { useState, useEffect } from "react"
import { useGame } from "../context/GameContext"

export default function GameStats() {
  const { contract, currentSession, fetchSessionInfo } = useGame()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (contract) {
      fetchSessionInfo(1) // Assuming we're always fetching the first session for simplicity
    }
  }, [contract, fetchSessionInfo])

  useEffect(() => {
    if (currentSession) {
      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000)
        const endTime = currentSession.startTime + currentSession.duration
        const remaining = Math.max(0, endTime - now)
        setTimeRemaining(remaining)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentSession])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-8 retro-text">Game Stats</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="retro-text">Current Session:</div>
        <div className="retro-text">{currentSession ? `#${currentSession.id}` : "N/A"}</div>
        <div className="retro-text">Time Remaining:</div>
        <div className="retro-text">{timeRemaining !== null ? formatTime(timeRemaining) : "N/A"}</div>
        <div className="retro-text">Total Stake:</div>
        <div className="retro-text">{currentSession ? `${currentSession.totalStake} ETH` : "N/A"}</div>
        <div className="retro-text">Players:</div>
        <div className="retro-text">{currentSession ? currentSession.playerCount : "N/A"}</div>
      </div>
    </div>
  )
}

