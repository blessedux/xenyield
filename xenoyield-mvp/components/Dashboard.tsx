"use client"

import { useState, useEffect } from "react"
import { useGame } from "../context/GameContext"
import SessionView from "./SessionView"
import GameStatusHUD from "./GameStatusHUD"
import ExoplanetSelection from "./ExoplanetSelection"

export default function Dashboard() {
  const { contract, currentSession, playerInfo, fetchSessionInfo, fetchPlayerInfo } = useGame()
  const [selectedExoplanet, setSelectedExoplanet] = useState(null)

  useEffect(() => {
    if (contract) {
      fetchSessionInfo(1) // Assuming we're always fetching the first session for simplicity
    }
  }, [contract, fetchSessionInfo]) // Added fetchSessionInfo to dependencies

  const handleExoplanetSelect = (exoplanet) => {
    setSelectedExoplanet(exoplanet)
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {currentSession && <SessionView session={currentSession} />}
      <ExoplanetSelection onSelect={handleExoplanetSelect} />
      {selectedExoplanet && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Selected Exoplanet: {selectedExoplanet.name}</h3>
          <p>Difficulty: {selectedExoplanet.difficulty}</p>
          <p>Base Reward: {selectedExoplanet.baseReward} XNY</p>
        </div>
      )}
      <GameStatusHUD />
    </div>
  )
}

