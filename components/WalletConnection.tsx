"use client"

import { useState } from "react"
import { useGame } from "@/context/GameContext"
import { Button } from "./ui/button"

export default function WalletConnection() {
  const [error, setError] = useState<string>("")
  const { gameState, connectWallet, disconnectWallet } = useGame()

  const handleConnect = async () => {
    try {
      setError("")
      console.log("Starting wallet connection...")
      
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to use this app.")
      }
      console.log("MetaMask detected")

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log("Accounts received:", accounts)
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      console.log("Current chainId:", chainId)

      // Check if the user is on the Mantle network
      if (chainId !== '0x13881') { // Replace '0x13881' with Mantle's chain ID
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }] // Replace with Mantle's chain ID
          })
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13881', // Replace with Mantle's chain ID
                    chainName: 'Mantle Testnet', // Replace with Mantle's network name
                    rpcUrls: ['https://rpc.mantle.network'], // Replace with Mantle's RPC URL
                    nativeCurrency: {
                      name: 'Mantle',
                      symbol: 'MNT',
                      decimals: 18
                    },
                    blockExplorerUrls: ['https://explorer.mantle.network'] // Replace with Mantle's block explorer URL
                  }
                ]
              })
            } catch (addError) {
              throw new Error("Failed to add Mantle network to MetaMask.")
            }
          } else {
            throw new Error("Failed to switch to Mantle network.")
          }
        }
      }

      // Connect wallet through context
      await connectWallet()
      console.log("Wallet connected successfully")
      
    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    }
  }

  return (
    <div className="mb-8">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
          {error}
        </div>
      )}
      
      {gameState.isConnected ? (
        <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded">
          <div>
            <p className="text-sm text-amber-500">Connected Wallet</p>
            <p className="font-mono text-amber-400">
              {gameState.wallet?.slice(0, 6)}...{gameState.wallet?.slice(-4)}
            </p>
          </div>
          <Button 
            onClick={disconnectWallet}
            variant="outline"
            className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect}
          className="bg-amber-500 hover:bg-amber-600 text-black"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

