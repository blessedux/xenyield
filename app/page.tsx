"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'
import Navbar from '@/components/Navbar'
import SplineBackground from '@/components/SplineBackground'
import { Button } from '@/components/button'
import Link from 'next/link'
import MainMenu from '@/components/MainMenu'
import Script from 'next/script'
import { useGame } from '@/context/GameContext'

const WalletConnection = dynamic(() => import('@/components/WalletConnection'), {
  ssr: false
})
const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function HomePage() {
  const { gameState } = useGame()
  const [showAbout, setShowAbout] = React.useState(false)

  // Loading state is now handled by GameContext
  if (!gameState) {
    return null
  }

  // Authenticated Home View
  if (gameState.isConnected) {
    return (
      <>
        {/* Interactive Background */}
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <iframe 
            src='https://my.spline.design/purpleplanetwithmoon-5d7e1cabc13dfe14cafb614e325dbe20/'
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'all' // Enable mouse interaction
            }}
            title="XenoYield Interactive Background"
          />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10">
          <main className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-6 animate-fadeIn backdrop-blur-sm bg-black/20 p-8 rounded-lg">
              <h2 className="text-2xl text-amber-500 font-mono">
                Welcome, Commander
              </h2>
              <p className="text-amber-400 font-mono">
                {gameState.wallet?.slice(0, 6)}...{gameState.wallet?.slice(-4)}
              </p>
              <Link 
                href="/game"
                className="inline-block px-8 py-4 bg-amber-500 text-black rounded-lg 
                          hover:bg-amber-600 transition-colors font-mono text-lg"
              >
                Enter Game
              </Link>
            </div>
          </main>
        </div>
      </>
    )
  }

  // Regular Home View
  return (
    <>
      {showAbout && (
        <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
      )}

      <Navbar />
      <SplineBackground />
      
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold text-amber-500 font-mono">
            XenYield
          </h1>
          
          <p className="text-xl text-gray-300 rounded-xl max-w-2xl mx-auto backdrop-blur-sm">
            Explore distant exoplanets, stake your claims, and earn rewards in this
            blockchain-powered space exploration game.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            <SimpleWalletConnect />
            
            <Button 
              onClick={() => setShowAbout(!showAbout)}
              variant="outline"
              size="lg"
              className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10 w-full max-w-xs"
            >
              {showAbout ? 'Hide Info' : 'About XEN'}
            </Button>
          </div>

          {/* About Section with Features and Video */}
          {showAbout && (
            <div className="animate-fadeIn space-y-16">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
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

              {/* Video Section */}
              <div className="mt-16">
                <div className="w-full max-w-5xl mx-auto">
                  <div className="relative" style={{ padding: '56.21% 0 0 0' }}>
                    <iframe
                      src="https://player.vimeo.com/video/1054774929?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0&controls=1"
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      title="XEN-YIELD"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}