"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/context/GameContext'
import GameBackground from '@/components/GameBackground'
import { useCountdown } from '@/hooks/useCountdown'
import { useXenYield } from '@/hooks/useXenYield'
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/24/solid'

export default function ExpeditionPage() {
  const { gameState } = useGame()
  const router = useRouter()
  const [resources] = useState(2)
  const [shield] = useState(89)
  const timeLeft = useCountdown('19:45') // This should come from game state
  const expeditionData = useXenYield()

  // Check authentication and active expedition
  useEffect(() => {
    if (!gameState.isConnected) {
      router.push('/')
    }
  }, [gameState.isConnected, router])

  return (
    <>
      <GameBackground />
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          {/* Top Stats Bar */}
          <div className="flex justify-between items-start px-4">
            <div className="backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-amber-500/20 font-mono text-amber-500">
              <pre className="whitespace-pre">
{`╔══════ EXPEDITION STATUS ══════╗
║                              ║
║  TIME LEFT  : ${timeLeft.padEnd(13)} ║
║  RESOURCES  : ${resources} XENOCRYSTAL ║
║  HOSTILES   : DETECTED      ║
║  SHIELD     : ${shield}%          ║
║                              ║
╚══════════════════════════════╝`}
              </pre>
            </div>

            {/* Mission Objectives */}
            <div className="backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-amber-500/20 font-mono text-amber-500">
              <pre className="whitespace-pre">
{`╔══════ ACTIVE MISSIONS ══════╗
║                             ║
║  [✗] SECURE MINING SITE    ║
║  [✗] EXTRACT XENOCRYSTALS  ║
║  [✗] ELIMINATE HOSTILES    ║
║                             ║
╚═════════════════════════════╝`}
              </pre>
            </div>
          </div>

          {/* Main Game View with background image */}
          <div className="relative h-[600px] backdrop-blur-sm bg-black/60 rounded-lg border border-amber-500/20 overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url("/Screenshot 2025-02-08 at 13.31.19.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Contract Info Overlay */}
            <div className="absolute top-4 right-4 font-mono text-amber-500 text-sm">
              <div className="backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-amber-500/20">
                <pre className="whitespace-pre">
{`╔══════ PROTOCOL STATUS ══════╗
║                            ║
║  TVL      : $${expeditionData.totalValueLocked.padEnd(11)} ║
║  YIELD    : ${expeditionData.currentYield}%${' '.repeat(11 - expeditionData.currentYield.length)} ║
║  STRATEGIES: ${expeditionData.activeStrategies}${' '.repeat(11 - String(expeditionData.activeStrategies).length)} ║
║                            ║
╚════════════════════════════╝`}
                </pre>
                <a 
                  href={expeditionData.blockExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center px-4 py-2 border border-amber-500/20 rounded hover:bg-amber-500/10 transition-colors"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  View on Explorer
                </a>
              </div>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="font-mono text-amber-500 text-center">
                <div className="mb-4 text-2xl">EXPEDITION IN PROGRESS</div>
                <div className="text-sm opacity-70">
                  Game view implementation coming soon...
                </div>
              </div>
            </div>

            {/* CRT effects */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-500/5" />
            <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />
          </div>
        </div>
      </main>
    </>
  )
} 