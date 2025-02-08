"use client"

import { useState } from 'react'
import RetroTerminal from '@/components/RetroTerminal'
import WalletConnection from '@/components/WalletConnection'
import Navbar from '@/components/Navbar'
import SplineBackground from '@/components/SplineBackground'
import { Button } from '@/components/button'
import Link from 'next/link'

export default function Home() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])

  const handleSend = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }])
    
    // TODO: Implement AI response logic here
    // For now, just echo back
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `Received: ${message}` 
    }])
  }

  return (
    <>
      <Navbar />
      <SplineBackground />
      
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 ">
          {/* Hero Section */}
          <h1 className="text-6xl font-bold text-amber-500 font-mono">
            XenYield
          </h1>
          
          <p className="text-xl text-gray-300 rounded-xl max-w-2xl mx-auto backdrop-blur-sm">
            Explore distant exoplanets, stake your claims, and earn rewards in this
            blockchain-powered space exploration game.
          </p>

          <div className="mt-8">
            <Link href="/game">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-black font-mono text-lg px-8 py-6"
              >
                Connect Wallet & Start Earning
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-amber-500 mb-2">Explore</h3>
              <p className="text-gray-300">Discover unique exoplanets with varying yields and characteristics</p>
            </div>
            <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-amber-500 mb-2">Stake</h3>
              <p className="text-gray-300">Claim your territory and stake MNT to start earning rewards</p>
            </div>
            <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-amber-500 mb-2">Earn</h3>
              <p className="text-gray-300">Generate passive income through your planetary investments</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 