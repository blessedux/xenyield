"use client"

import React from 'react'

interface StakingWindowProps {
  strategy: {
    name: string
    risk: string
    yield: string
    duration: string
  }
  amount: string
  onConfirm: () => void
  onCancel: () => void
}

export default function StakingWindow({ strategy, amount, onConfirm, onCancel }: StakingWindowProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-sm bg-black/80 p-6 rounded-lg border border-amber-500/20 max-w-md w-full">
        <div className="font-mono text-amber-500">
          <pre className="whitespace-pre-wrap mb-6">
{`╔══════ MISSION PREPARATION ══════╗
║                               ║
║  STRATEGY : ${strategy.name.padEnd(14)} ║
║  RISK LVL : ${strategy.risk.padEnd(14)} ║
║  YIELD    : ${strategy.yield.padEnd(14)} ║
║  DURATION : ${strategy.duration.padEnd(14)} ║
║                               ║
║  STAKE    : ${amount.padEnd(14)} ║
║                               ║
╚═══════════════════════════════╝`}
          </pre>

          <div className="space-y-4">
            <div className="text-sm opacity-70">
              Funds will be transferred to the Ark liquidity pool for the duration of the expedition.
              Early withdrawal will result in penalties.
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-amber-500/20 rounded hover:bg-amber-500/10 transition-colors"
              >
                ABORT
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-amber-500/20 border border-amber-500/20 rounded hover:bg-amber-500/30 transition-colors"
              >
                LAUNCH
              </button>
            </div>
          </div>
        </div>

        {/* CRT effects */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-500/5" />
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />
      </div>
    </div>
  )
} 