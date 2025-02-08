"use client"

import React, { useState, useEffect, useRef } from "react"
import { useGame } from "@/context/GameContext"

interface RetroTerminalProps {
  onSend: (message: string) => void
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export default function RetroTerminal({ onSend, messages }: RetroTerminalProps) {
  const [input, setInput] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const { gameState } = useGame()

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-black/90 border border-amber-500/20">
      {/* CRT screen effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-500/5" />
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="h-full overflow-auto p-4 font-mono text-amber-500 text-sm"
        style={{
          textShadow: '0 0 5px rgba(240, 173, 78, 0.5)',
        }}
      >
        {/* Welcome message */}
        <div className="mb-4 text-amber-400">
          {`Welcome to XenoYield Terminal v1.0.0\n`}
          {`Connected address: ${gameState?.wallet || 'Not connected'}\n`}
          {`Type 'help' for available commands.\n`}
          {`----------------------------------------\n`}
        </div>

        {/* Message history */}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'assistant' ? 'text-green-500' : 'text-amber-500'}`}>
            <span className="mr-2">{msg.role === 'assistant' ? 'AI>' : '$'}</span>
            <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
          </div>
        ))}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <span className="mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-amber-500 font-mono"
            placeholder="Type your message..."
          />
        </form>
      </div>
    </div>
  )
} 