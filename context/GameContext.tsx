"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GameState {
  isConnected: boolean
  wallet: string | null
  chainId: string | null
}

interface GameContextType {
  gameState: GameState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    wallet: null,
    chainId: null
  })

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask")
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      // Get chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      })

      setGameState({
        isConnected: true,
        wallet: accounts[0],
        chainId: chainId
      })

      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }

    setGameState({
      isConnected: false,
      wallet: null,
      chainId: null
    })
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setGameState(prev => ({
        ...prev,
        wallet: accounts[0]
      }))
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

// Add TypeScript support for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

