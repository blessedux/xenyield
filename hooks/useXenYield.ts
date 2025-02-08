import * as React from 'react'
import { useAccount } from 'wagmi'

const BLOCK_EXPLORER_URL = "https://explorer.testnet.mantle.xyz"

export function useXenYield() {
  const { address } = useAccount()
  
  const [expeditionData, setExpeditionData] = React.useState({
    totalValueLocked: '0',
    currentYield: '0',
    activeStrategies: 0,
    blockExplorerUrl: BLOCK_EXPLORER_URL
  })

  React.useEffect(() => {
    // Mock data for deployment
    const mockData = {
      totalValueLocked: '1000',
      currentYield: '5.00',
      activeStrategies: 2,
      blockExplorerUrl: BLOCK_EXPLORER_URL
    }

    // Simulate fetching data
    setExpeditionData(mockData)
  }, [address])

  return expeditionData
} 