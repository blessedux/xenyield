"use client"

import React, { useState, useEffect, useRef } from "react"
import { useGame } from "@/context/GameContext"

interface Message {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

interface RetroTerminalProps {
  onSend: (message: string) => void
  messages: Message[]
}

export default function RetroTerminal({ onSend, messages }: RetroTerminalProps) {
  const [input, setInput] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const { gameState } = useGame()

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const typeMessage = async (message: Message, index: number) => {
      // Check if message already exists by comparing content
      const messageExists = displayedMessages.some(m => m.content === message.content)
      
      if (index < messages.length && !messageExists) {
        setIsTyping(true)
        const chars = message.content.split('')
        let typed = ''
        
        setDisplayedMessages(prev => [
          ...prev,
          { ...message, content: '', isTyping: true }
        ])

        for (const char of chars) {
          typed += char
          setDisplayedMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = { ...message, content: typed, isTyping: true }
            return newMessages
          })
          await new Promise(resolve => setTimeout(resolve, 15))
        }
        
        setDisplayedMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = { ...message, isTyping: false }
          return newMessages
        })
        setIsTyping(false)
      }
    }

    if (messages.length > displayedMessages.length) {
      typeMessage(messages[displayedMessages.length], displayedMessages.length)
    }
  }, [messages, displayedMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-black/40 border border-amber-500/20">
      {/* CRT screen effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-amber-500/5" />
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-5" />

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="h-full overflow-auto p-4 font-mono text-amber-500 text-sm backdrop-blur-sm"
        style={{
          textShadow: '0 0 5px rgba(240, 173, 78, 0.5)',
        }}
      >
        {/* Welcome message */}
        <div className="mb-4 text-amber-400">
          <pre className="whitespace-pre-wrap">
{`
╔══════════════════════════════════════════╗
║         XENYIELD TERMINAL v1.0.0        ║
╚══════════════════════════════════════════╝

ESTABLISHING SECURE CONNECTION...
CONNECTION ESTABLISHED

WALLET: ${gameState?.wallet || 'NOT CONNECTED'}
STATUS: READY FOR EXPEDITION

Type 'help' to view available commands.
----------------------------------------
`}</pre>
        </div>

        {/* Message history with typewriter effect */}
        {displayedMessages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'assistant' ? 'text-green-500' : 'text-amber-500'}`}>
            <span className="mr-2">{msg.role === 'assistant' ? '>' : '$'}</span>
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
              {msg.isTyping && <span className="animate-pulse">▊</span>}
            </span>
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
            placeholder="Type your command..."
            disabled={isTyping}
          />
        </form>
      </div>
    </div>
  )
} 