"use client"

import { useState } from "react"
import { useGame } from "../context/GameContext"
<<<<<<< HEAD
import { Button } from "XENYIELD/xenyield-mvp/components/button"
=======
import { Button } from "@/components/ui/button"
>>>>>>> 5bc7cfdc607cf583355e3324613fed27f8263e43
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Exoplanet {
  id: string
  name: string
  difficulty: number
  baseReward: number
}

interface ExoplanetSelectionProps {
  onSelect: (exoplanet: Exoplanet) => void
}

export default function ExoplanetSelection({ onSelect }: ExoplanetSelectionProps) {
  const { contract } = useGame()
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([])
  const [selectedExoplanet, setSelectedExoplanet] = useState<Exoplanet | null>(null)

  // In a real implementation, you would fetch this data from the smart contract
  // For now, we'll use mock data
  useState(() => {
    const mockExoplanets: Exoplanet[] = [
      { id: "1", name: "Alpha Centauri", difficulty: 1, baseReward: 100 },
      { id: "2", name: "Proxima b", difficulty: 2, baseReward: 200 },
      { id: "3", name: "Kepler-186f", difficulty: 3, baseReward: 300 },
    ]
    setExoplanets(mockExoplanets)
  }, [])

  const handleSelect = (exoplanet: Exoplanet) => {
    setSelectedExoplanet(exoplanet)
    onSelect(exoplanet)
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Select Exoplanet</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exoplanets.map((exoplanet) => (
          <Card key={exoplanet.id} className={selectedExoplanet?.id === exoplanet.id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{exoplanet.name}</CardTitle>
              <CardDescription>Difficulty: {exoplanet.difficulty}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Base Reward: {exoplanet.baseReward} XNY</p>
              <Button onClick={() => handleSelect(exoplanet)}>Select</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

