"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ethers } from 'ethers'
import { XENOYIELD_CONTRACT_ADDRESS } from "../config/contracts"
import { XENOYIELD_ABI } from "../config/contractABI"

interface GameState {
  isConnected: boolean
  wallet: string | null
  chainId: string | null
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
}

interface GameContextType {
  gameState: GameState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  contract: ethers.Contract | null
  currentSession: any | null
  fetchSessionInfo: (sessionId: number) => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    wallet: null,
    chainId: null,
    provider: null,
    signer: null
  })
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [currentSession, setCurrentSession] = useState(null)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask")
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const network = await provider.getNetwork()

      setGameState({
        isConnected: true,
        wallet: accounts[0],
        chainId: network.chainId.toString(),
        provider,
        signer
      })

      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      const xenoYieldContract = new ethers.Contract(XENOYIELD_CONTRACT_ADDRESS, XENOYIELD_ABI, signer)
      setContract(xenoYieldContract)

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
      chainId: null,
      provider: null,
      signer: null
    })

    setContract(null)
    setCurrentSession(null)
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

  const fetchSessionInfo = async (sessionId: number) => {
    if (!contract) return
    try {
      const sessionInfo = await contract.getSessionInfo(sessionId)
      setCurrentSession(sessionInfo)
    } catch (error) {
      console.error("Failed to fetch session info:", error)
    }
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        connectWallet,
        disconnectWallet,
        contract,
        currentSession,
        fetchSessionInfo,
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

