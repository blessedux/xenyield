"use client"

import { useState } from 'react'
import { useGame } from '@/context/GameContext'
import { useRouter } from 'next/navigation'

export default function SimpleWalletConnect() {
  const { gameState, connectWallet, disconnectWallet } = useGame()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleConnect = async () => {
    try {
      setError(null)
      setIsConnecting(true)

      if (!window.ethereum) {
        throw new Error("Please install MetaMask to connect")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      // Request signature for authentication
      try {
        const message = "Welcome to XenoYield! Please sign this message to verify your wallet ownership."
        const from = accounts[0]
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, from]
        })
        console.log("Signature:", signature)
      } catch (signError) {
        throw new Error("Failed to sign authentication message")
      }

      await connectWallet()

    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    // Always navigate to home page on disconnect
    router.push('/')
  }

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={gameState.isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className="w-full px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-600 
                   transition-colors disabled:opacity-50 font-mono text-lg"
      >
        {isConnecting ? 'Connecting...' : 
         gameState.isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      {error && (
        <div className="mt-2 p-2 text-sm bg-red-500/10 text-red-500 rounded">
          {error}
        </div>
      )}

      {gameState.wallet && (
        <div className="mt-2 text-xs text-center text-amber-500">
          <span className="text-green-500">✓</span>{' '}
          {gameState.wallet.slice(0, 6)}...{gameState.wallet.slice(-4)}
        </div>
      )}
    </div>
  )
} 