"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { ethers } from "ethers"
import { XENOYIELD_CONTRACT_ADDRESS } from "../config/contracts"
import { XENOYIELD_ABI } from "../config/contractABI"

interface GameContextType {
  contract: ethers.Contract | null
  currentSession: any | null
  connectWallet: () => Promise<void>
  fetchSessionInfo: (sessionId: number) => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [currentSession, setCurrentSession] = useState(null)

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const xenoYieldContract = new ethers.Contract(XENOYIELD_CONTRACT_ADDRESS, XENOYIELD_ABI, signer)
        setContract(xenoYieldContract)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
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
        contract,
        currentSession,
        connectWallet,
        fetchSessionInfo,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

