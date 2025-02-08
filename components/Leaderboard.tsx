"use client"

import { useState, useEffect } from "react"
import { useGame } from "../context/GameContext"
import { AnimatePresence, motion } from "framer-motion"
import AnimatedNumber from "./AnimatedNumber"

interface LeaderboardEntry {
  address: string
  totalRewards: number
}

export default function Leaderboard() {
  const { contract } = useGame()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    if (contract) {
      fetchLeaderboard()
    }
  }, [contract])

  const fetchLeaderboard = async () => {
    // This is a placeholder. In a real implementation, you'd fetch this data from your backend or smart contract
    const mockLeaderboard = [
      { address: "0x1234...5678", totalRewards: 1000 },
      { address: "0x5678...9012", totalRewards: 750 },
      { address: "0x9012...3456", totalRewards: 500 },
    ]
    setLeaderboard(mockLeaderboard)
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
      <AnimatePresence>
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center p-2 bg-gray-800 rounded mb-2"
          >
            <span>{entry.address}</span>
            <AnimatedNumber value={entry.totalRewards} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

