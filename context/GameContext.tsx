"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

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

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    wallet: null,
    chainId: null
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            setGameState({
              isConnected: true,
              wallet: accounts[0],
              chainId
            })
          }
        } catch (error) {
          console.error('Failed to check existing connection:', error)
        }
      }
      setIsInitialized(true)
    }

    checkConnection()
  }, [])

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask")
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      })

      setGameState({
        isConnected: true,
        wallet: accounts[0],
        chainId
      })

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

  if (!isInitialized) {
    return null
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

