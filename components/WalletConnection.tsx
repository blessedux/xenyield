"use client"

import { useState, useEffect } from "react"
import { useGame } from "../context/GameContext"

interface WalletConnectionProps {
  onConnected: () => void
}

export default function WalletConnection({ onConnected }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connectWallet, contract } = useGame()

  useEffect(() => {
    if (contract) {
      onConnected()
    }
  }, [contract, onConnected])

  const handleConnect = async () => {
    setIsConnecting(true)
    await connectWallet()
    setIsConnecting(false)
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-8 retro-text">Connect Wallet</h2>
      <button className="retro-button" onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  )
}

