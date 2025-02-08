"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'

const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function GamePage() {
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string}>>([])

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

  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <SimpleWalletConnect />
        <RetroTerminal 
          messages={messages}
          onSend={handleSend}
        />
      </div>
    </main>
  )
} 