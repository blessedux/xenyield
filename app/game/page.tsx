"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'
import GameBackground from '@/components/GameBackground'
import RetroMonitor from '@/components/RetroMonitor'
import { useGame } from '@/context/GameContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { initialGameMessages } from '@/utils/gameMessages'
import StakingWindow from '@/components/StakingWindow'
import { useCountdown } from '@/hooks/useCountdown'

const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function GamePage() {
  const { gameState } = useGame()
  const router = useRouter()
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [showStaking, setShowStaking] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<{
    name: string
    risk: string
    yield: string
    duration: string
  } | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)

  // Check authentication on page load
  useEffect(() => {
    if (!gameState.isConnected) {
      router.push('/')
    }
  }, [gameState.isConnected, router])

  // Add initial messages on mount
  useEffect(() => {
    const addMessagesWithDelay = async () => {
      for (const message of initialGameMessages) {
        setMessages(prev => [...prev, message])
        // Wait for the typing animation to complete (approximate time)
        await new Promise(resolve => setTimeout(resolve, message.content.length * 30 + 500))
      }
    }
    
    if (messages.length === 0) {
      addMessagesWithDelay()
    }
  }, [])

  const handleSend = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }])

    // Basic command handling
    const response = handleCommand(message.toLowerCase())
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  }

  const handleCommand = (command: string): string => {
    const [cmd, ...args] = command.split(' ')
    
    switch (cmd) {
      case 'help':
        return `Available commands:
- help: Show this help message
- select <strategy>: Choose yield strategy (conservative/balanced/aggressive)
- bounty <number>: Accept a bounty mission
- status: Check current mission status
- scan: Scan planet for resources
- inventory: Check your equipment and resources`
      case 'select':
        const strategy = args[0]
        if (!strategy) return 'Please specify a strategy: conservative, balanced, or aggressive'
        
        const strategyDetails = {
          conservative: {
            name: 'CONSERVATIVE',
            risk: 'LOW (10%)',
            yield: '10-20%',
            duration: '20:00'
          },
          balanced: {
            name: 'BALANCED',
            risk: 'MEDIUM (30%)',
            yield: '30-50%',
            duration: '35:00'
          },
          aggressive: {
            name: 'AGGRESSIVE',
            risk: 'HIGH (50%)',
            yield: '50-90%',
            duration: '50:00'
          }
        }[strategy.toLowerCase()]

        if (!strategyDetails) return 'Invalid strategy. Choose: conservative, balanced, or aggressive'
        
        setSelectedStrategy(strategyDetails)
        setShowStaking(true)
        return `Yield strategy set to: ${strategy.toUpperCase()}\nPreparing expedition loadout...`
      case 'bounty':
        const bountyId = args[0]
        if (!bountyId) return 'Please specify a bounty number (1-3)'
        return `Bounty #${bountyId} accepted. Mission details uploaded to your neural interface.`
      case 'about':
        return 'XenYield is a blockchain-based space exploration game where you can discover and stake claims on distant exoplanets.'
      case 'balance':
        return 'Feature coming soon: Check your wallet balance'
      case 'explore':
        return 'Feature coming soon: Start exploring planets'
      case 'quickstart':
        setSelectedStrategy({
          name: 'CONSERVATIVE',
          risk: 'LOW (10%)',
          yield: '10-20%',
          duration: '20:00'
        })
        setShowStaking(true)
        return 'Initiating quick start with Conservative strategy...'
      default:
        return `Command not recognized. Type 'help' for available commands.`
    }
  }

  const handleStakingConfirm = async () => {
    setShowStaking(false)
    setIsLaunching(true)
    
    // Initial launch message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `MISSION LAUNCHED
      
Transferring funds to Ark liquidity pool...
Initializing defense systems...
Preparing mining equipment...

Expedition will commence in T-10 seconds.`
    }])

    // Countdown sequence
    for (let i = 9; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: i === 0 
          ? `T-0: LAUNCH INITIATED - GOOD LUCK, EXPLORER`
          : `T-${i}...`
      }])
    }

    // Transition to expedition page
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/game/expedition')
  }

  if (!gameState.isConnected) {
    return null // or a loading state
  }

  return (
    <>
      <GameBackground />
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          <div className="flex justify-between items-start px-4">
            {/* Stats Monitor */}
            <RetroMonitor 
              nextExpedition="02:45:30"
              yieldRate={12.5}
              duration="20:00"
              riskLevel="MEDIUM"
              arkPosition="DOCKED"
            />
            
            {/* Wallet Connect */}
            <div className="backdrop-blur-sm bg-black/40 p-2 rounded-lg border border-amber-500/20">
              <SimpleWalletConnect />
            </div>
          </div>
          
          <div className="backdrop-blur-sm bg-black/60 rounded-lg overflow-hidden">
            <RetroTerminal 
              messages={messages}
              onSend={handleSend}
            />
          </div>
        </div>
        
        {showStaking && selectedStrategy && (
          <StakingWindow
            strategy={selectedStrategy}
            amount="1000 USDC"
            onConfirm={handleStakingConfirm}
            onCancel={() => setShowStaking(false)}
          />
        )}
      </main>
    </>
  )
} 