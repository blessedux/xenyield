"use client"

import React from 'react'
import { useCountdown } from '@/hooks/useCountdown'

interface RetroMonitorProps {
  nextExpedition: string // Time until next expedition
  yieldRate: number // Current yield percentage
  duration: string // Expedition duration
  riskLevel: string // Current risk level
  arkPosition: string // Current Ark position
}

export default function RetroMonitor({
  nextExpedition,
  yieldRate,
  duration,
  riskLevel,
  arkPosition
}: RetroMonitorProps) {
  const timeLeft = useCountdown(nextExpedition)

  return (
    <div className="backdrop-blur-sm bg-black/40 p-4 rounded-lg border border-amber-500/20">
      <div className="font-mono text-xs">
        <pre className="text-amber-500 whitespace-pre">
{`╔══════ EXPEDITION STATS ══════╗
║                            ║
║  NEXT LAUNCH: ${timeLeft.padEnd(11)} ║
║  YIELD RATE: ${(yieldRate + '%').padEnd(12)} ║
║  DURATION  : ${duration.padEnd(11)} ║
║  RISK LEVEL: ${riskLevel.padEnd(11)} ║
║  ARK STATUS: ${arkPosition.padEnd(11)} ║
║                            ║
╚════════════════════════════╝`}
        </pre>
      </div>
      {/* CRT screen effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-500/5" />
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />
    </div>
  )
} 