"use client"

import Button from "@/components/ui/button"
import { TomoChainTestnet, TomoChain } from "@/config/chains"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import ConnectWalletUI from "@/components/connect-wallet/connect-wallet"
import { Networks } from "@/utils"
import * as process from "process"

export default function GetMainSection({
  children,
}: React.PropsWithChildren<{}>) {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const network =
    process.env.NEXT_PUBLIC_NETWORK === "mainnet"
      ? Networks.mainnet
      : Networks.testnet
  const selectChain =
    process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? TomoChain : TomoChainTestnet

  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork({
      // throwForSwitchChainNotSupported: true,
      onError(error) {
        window.ethereum.request(network)
      },
    })

  if (!address) {
    return <ConnectWalletUI></ConnectWalletUI>
  } else if (chain?.id != selectChain.id) {
    return (
      <div className={"absolute left-1/2 top-1/2 flex flex-col gap-y-3 p-5"}>
        <p>Please switch to {selectChain.name} network.</p>
        <Button
          className={"mx-auto"}
          size={"medium"}
          shape={"rounded"}
          onClick={() => switchNetwork?.(selectChain.id)}
        >
          Switch Chain
        </Button>
      </div>
    )
  } else {
    return (
      <div className={"px-4 pb-4 pt-4 sm:px-6 lg:px-8 3xl:px-10 3xl:pt-0.5"}>
        {children}
      </div>
    )
  }
}
