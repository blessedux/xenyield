"use client"

import { useState, useEffect } from "react"

interface Player {
  address: string
  stake: number
  lives: number
}

interface Session {
  id: string
  players: Player[]
  timeRemaining: number
  totalStake: number
}

export default function SessionView({ session }: { session: Session }) {
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-8 p-4 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Active Session</h3>
      <p>Session ID: {session.id}</p>
      <p>Time Remaining: {timeRemaining} seconds</p>
      <p>Total Stake: {session.totalStake} ETH</p>
      <h4 className="text-lg font-bold mt-4 mb-2">Players:</h4>
      <ul>
        {session.players.map((player, index) => (
          <li key={index} className="mb-2">
            <p>Address: {player.address}</p>
            <p>Stake: {player.stake} ETH</p>
            <p>Lives: {player.lives}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

