import * as React from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatEther } from 'viem'
import { createPublicClient, http } from 'viem'

// Import ABIs (we'll need to create these from our contracts)
import XenYieldPoolABI from '@/contracts/abis/XenYieldPool.json'
import StrategyManagerABI from '@/contracts/abis/StrategyManager.json'

const POOL_ADDRESS = process.env.NEXT_PUBLIC_POOL_ADDRESS
const STRATEGY_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_MANAGER_ADDRESS
const BLOCK_EXPLORER_URL = "https://explorer.testnet.mantle.xyz"

export function useXenYield() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  
  const [expeditionData, setExpeditionData] = React.useState({
    totalValueLocked: '0',
    currentYield: '0',
    activeStrategies: 0,
    blockExplorerUrl: BLOCK_EXPLORER_URL
  })

  React.useEffect(() => {
    const fetchData = async () => {
      if (!publicClient || !address) return

      try {
        const pool = publicClient.getContract({
          address: POOL_ADDRESS as `0x${string}`,
          abi: XenYieldPoolABI,
        })

        const strategyManager = publicClient.getContract({
          address: STRATEGY_MANAGER_ADDRESS as `0x${string}`,
          abi: StrategyManagerABI,
        })

        const [tvl, strategies, apy] = await Promise.all([
          pool.read.totalValueLocked(),
          strategyManager.read.getActiveStrategies(),
          strategyManager.read.getTotalExpectedAPY()
        ])

        setExpeditionData({
          totalValueLocked: formatEther(tvl),
          currentYield: (Number(apy) / 100).toFixed(2),
          activeStrategies: strategies.length,
          blockExplorerUrl: BLOCK_EXPLORER_URL
        })
      } catch (error) {
        console.error('Error fetching expedition data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [publicClient, address])

  return expeditionData
} 