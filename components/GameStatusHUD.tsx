"use client"

import { useState, useEffect } from "react"

export default function GameStatusHUD() {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [currentStake, setCurrentStake] = useState(0)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(3600)
  const [playersAlive, setPlayersAlive] = useState(10)
  const [dockingCountdown, setDockingCountdown] = useState(1800)

  useEffect(() => {
    // TODO: Fetch real-time data from smart contract
    // For now, we'll use mock data and a simple countdown
    const timer = setInterval(() => {
      setSessionTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
      setDockingCountdown((prevTime) => (prevTime > 0 ? prevTime - 1 : 1800))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-8 p-4 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Game Status HUD</h3>
      <p>Player Health: {playerHealth}%</p>
      <p>Current Stake: {currentStake} ETH</p>
      <p>Session Time Remaining: {sessionTimeRemaining} seconds</p>
      <p>Players Alive: {playersAlive}</p>
      <p>Docking Countdown: {dockingCountdown} seconds</p>
    </div>
  )
}

