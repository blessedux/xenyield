"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig } from 'wagmi'
import { mantleTestnet } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [wagmiConfig] = useState(() => createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain: mantleTestnet,
      transport: http()
    })
  }))

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
} 