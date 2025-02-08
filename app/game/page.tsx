"use client"

import { RetroTerminal } from '@/components/RetroTerminal'
import { WalletConnection } from '@/components/WalletConnection'

export default function GamePage() {
  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <WalletConnection />
        <RetroTerminal 
          messages={[]}
          onSend={() => {}}
        />
      </div>
    </main>
  )
} 