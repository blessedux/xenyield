"use client"

import React, { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import SimpleWalletConnect from '@/components/SimpleWalletConnect'
import Navbar from '@/components/Navbar'
import SplineBackground from '@/components/SplineBackground'
import { Button } from '@/components/button'
import Link from 'next/link'
import MainMenu from '@/components/MainMenu'
import Script from 'next/script'

const WalletConnection = dynamic(() => import('@/components/WalletConnection'), {
  ssr: false
})
const RetroTerminal = dynamic(() => import('@/components/RetroTerminal'), {
  ssr: false
})

export default function HomePage() {
  const [showAbout, setShowAbout] = React.useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (!showAbout) return // Don't calculate scroll progress if about section is hidden
      
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const progress = Math.min(scrollPosition / (documentHeight * 0.5), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAbout]) // Add showAbout as dependency

  return (
    <>
      {showAbout && (
        <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
      )}
      
      {/* Gradient Overlay that becomes opaque on scroll only when about is shown */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-gradient-to-b from-black/0 via-black to-black pointer-events-none transition-opacity duration-300"
          style={{ opacity: scrollProgress }}
        />
      )}

      <Navbar />
      <SplineBackground />
      
      <main className="relative">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
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

            {/* About Section with Video - Conditionally Rendered */}
            {showAbout && (
              <div className="animate-fadeIn">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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
                <div className="mt-16 min-h-screen flex items-center justify-center relative">
                  <div className="w-full max-w-5xl mx-auto">
                    <div className="relative" style={{ padding: '56.21% 0 0 0' }}>
                      <iframe
                        src="https://player.vimeo.com/video/1054774929?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0&controls=1"
                        className="absolute top-0 left-0 w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        title="XEN-YIELD"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}