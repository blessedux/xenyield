"use client"

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Message to sign for authentication
const SIGN_MESSAGE = "Welcome to XenoYield! Please sign this message to verify your wallet ownership."

export default function SimpleWalletConnect() {
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      }
    } catch (err) {
      console.error("Error checking connection:", err)
    }
  }

  const signMessage = async (address: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(SIGN_MESSAGE)
      
      // Here you would typically verify the signature on your backend
      console.log("Signature:", signature)
      setIsAuthenticated(true)
      
      return true
    } catch (err) {
      console.error("Error signing message:", err)
      setError("Failed to sign authentication message")
      return false
    }
  }

  const connectWallet = async () => {
    try {
      setError(null)
      setIsConnecting(true)

      if (!window.ethereum) {
        throw new Error("Please install MetaMask to connect")
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      // Get the first account
      const account = accounts[0]
      setAccount(account)

      // Request signature for authentication
      const signed = await signMessage(account)
      if (!signed) {
        throw new Error("Failed to authenticate wallet")
      }

      console.log("Wallet connected and authenticated successfully")

    } catch (err) {
      console.error("Connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect")
      setAccount(null)
      setIsAuthenticated(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setIsAuthenticated(false)
  }

  // Initialize connection check
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsAuthenticated(false) // Require re-authentication on account change
        } else {
          setAccount(null)
          setIsAuthenticated(false)
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
      }
    }
  }, [])

  const handleGameStart = () => {
    if (!isAuthenticated) {
      connectWallet()
    } else {
      // Navigate to game page
      window.location.href = '/game'
    }
  }

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={handleGameStart}
        disabled={isConnecting}
        className="w-full px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-600 
                   transition-colors disabled:opacity-50 font-mono text-lg"
      >
        {isConnecting ? 'Connecting...' : 
         isAuthenticated ? 'Enter Game' : 'Connect Wallet'}
      </button>

      {error && (
        <div className="mt-2 p-2 text-sm bg-red-500/10 text-red-500 rounded">
          {error}
        </div>
      )}

      {account && (
        <div className="mt-2 text-xs text-center">
          <div className="text-amber-500">
            {isAuthenticated ? (
              <>
                <span className="text-green-500">✓</span>{' '}
                {account.slice(0, 6)}...{account.slice(-4)}
              </>
            ) : (
              <span className="text-yellow-500">Waiting for signature...</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 