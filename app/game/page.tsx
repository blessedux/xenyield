"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'
import GameBackground from '@/components/GameBackground'
import { useGame } from '@/context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function GamePage() {
  const { gameState } = useGame()
  const router = useRouter()
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string}>>([])

  // Check authentication on page load
  useEffect(() => {
    if (!gameState.isConnected) {
      router.push('/')
    }
  }, [gameState.isConnected, router])

  const handleSend = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }])

    // Basic command handling
    const response = handleCommand(message.toLowerCase())
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  }

  const handleCommand = (command: string): string => {
    switch (command) {
      case 'help':
        return `Available commands:
- help: Show this help message
- about: Learn about XenoYield
- balance: Check your wallet balance
- explore: Start exploring planets`
      case 'about':
        return 'XenoYield is a blockchain-based space exploration game where you can discover and stake claims on distant exoplanets.'
      case 'balance':
        return 'Feature coming soon: Check your wallet balance'
      case 'explore':
        return 'Feature coming soon: Start exploring planets'
      default:
        return `Command not recognized. Type 'help' for available commands.`
    }
  }

  if (!gameState.isConnected) {
    return null // or a loading state
  }

  return (
    <>
      <GameBackground />
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          <div className="flex justify-end">
            <SimpleWalletConnect />
          </div>
          <div className="backdrop-blur-sm bg-black/60 rounded-lg overflow-hidden">
            <RetroTerminal 
              messages={messages}
              onSend={handleSend}
            />
          </div>
        </div>
      </main>
    </>
  )
} 