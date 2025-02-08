"use client"

import { useState } from "react"
import { useGame } from "@/context/GameContext"
import { Button } from "./ui/button"

export default function WalletConnection() {
  const [error, setError] = useState<string>("")
  const { gameState, connectWallet, disconnectWallet } = useGame()

  const handleConnect = async () => {
    try {
      setError("")
      await connectWallet()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    }
  }

  return (
    <div className="mb-8">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
          {error}
        </div>
      )}
      
      {gameState.isConnected ? (
        <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded">
          <div>
            <p className="text-sm text-amber-500">Connected Wallet</p>
            <p className="font-mono text-amber-400">
              {gameState.wallet?.slice(0, 6)}...{gameState.wallet?.slice(-4)}
            </p>
          </div>
          <Button 
            onClick={disconnectWallet}
            variant="outline"
            className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect}
          className="bg-amber-500 hover:bg-amber-600 text-black"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
} 