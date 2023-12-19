"use client"

import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"
import {
  Chain,
  configureChains,
  createConfig,
  WagmiConfig as WagmiConfigWrapper,
} from "wagmi"
import { TomoChainTestnet, TomoChain } from "@/config/chains"

const chains: Chain[] = [TomoChainTestnet, TomoChain]
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ""

export const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function WagmiConfig({ children }: React.PropsWithChildren) {
  return (
    <>
      <WagmiConfigWrapper config={wagmiConfig}>{children}</WagmiConfigWrapper>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
