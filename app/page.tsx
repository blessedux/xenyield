"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'
import Navbar from '@/components/Navbar'
import SplineBackground from '@/components/SplineBackground'
import { Button } from '@/components/button'
import Link from 'next/link'
import MainMenu from '@/components/MainMenu'

const WalletConnection = dynamic(() => import('@/components/WalletConnection'), {
  ssr: false
})
const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function HomePage() {
  const [showAbout, setShowAbout] = React.useState(false)

  return (
    <>
      <Navbar />
      <SplineBackground />
      
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <h1 className="text-6xl font-bold text-amber-500 font-mono">
            XenoYield
          </h1>
          
          <p className="text-xl text-gray-300 rounded-xl max-w-2xl mx-auto backdrop-blur-sm">
            Explore distant exoplanets, stake your claims, and earn rewards in this
            blockchain-powered space exploration game.
          </p>

          {/* Main CTA - Connect Wallet to Start */}
          <div className="mt-8 space-y-4">
            <SimpleWalletConnect />
            <Button 
              onClick={() => setShowAbout(!showAbout)}
              variant="outline"
              className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
            >
              About XEN
            </Button>
          </div>

          {/* About Section - Conditionally Rendered */}
          {showAbout && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fadeIn">
              <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-amber-500 mb-2">Explore</h3>
                <p className="text-gray-300">
                  Discover unique exoplanets with varying yields and characteristics
                </p>
              </div>
              <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-amber-500 mb-2">Stake</h3>
                <p className="text-gray-300">
                  Claim your territory and stake MNT to start earning rewards
                </p>
              </div>
              <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-amber-500 mb-2">Earn</h3>
                <p className="text-gray-300">
                  Generate passive income through your planetary investments
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}