import { Transaction } from "ethers"
import { useState } from "react"
import { useAccount } from "wagmi"
import { prepareWriteContract } from "wagmi/actions"

import { DEFAULT_APPROVAL_TOKEN_AMOUNT, ERC20_SYMBOL } from "@/config"
import PandaTokenABI from "@/config/abis/PandaToken"
import {
  BusdTokenAddress,
  MarketplaceAddress,
  MarketplaceContract,
} from "@/config/contracts"
import { useModalContext } from "@/hooks/useModal"
import useTokenAllowance from "@/hooks/useTokenAllowance"
import { waitForContractWrite } from "@/utils/contract"
import { formatTokenAmount } from "@/utils/token"
import Button from "../ui/button"

export type ApproveTokenResult = {
  approved: boolean
}

export const ApproveTokenModal = ({ price }: { price: bigint }) => {
  const { close, resolve } = useModalContext()
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState<(Error & Transaction) | undefined>(
    undefined,
  )

  const { address } = useAccount()
  const { allowance, refetch } = useTokenAllowance(
    BusdTokenAddress,
    address!,
    MarketplaceContract.address,
  )

  async function handleApprove() {
    setIsApproving(true)
    setError(undefined)

    try {
      const config = await prepareWriteContract({
        abi: PandaTokenABI,
        address: BusdTokenAddress,
        functionName: "approve",
        args: [MarketplaceAddress, DEFAULT_APPROVAL_TOKEN_AMOUNT],
      })
      const res = await waitForContractWrite(config)
      if (!res || res.status !== "success") return

      const newRes = await refetch()
      if (newRes.data! >= price) {
        resolve<ApproveTokenResult>({ approved: true })
      }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <>
      <p className="max-w-xl">
        Before buying this Hero, you need to allow the Marketplace to spend at
        least{" "}
        <span className="font-mono text-green-500">
          {formatTokenAmount(price)}
        </span>{" "}
        {ERC20_SYMBOL}.
      </p>
      <p className="mt-2 text-sm italic">
        Current allowance:{" "}
        <span className="text-yellow-400">
          {formatTokenAmount(allowance || BigInt(0))}
        </span>{" "}
        {ERC20_SYMBOL}
      </p>
      <div className="mt-4 flex w-full">
        <Button
          shape="rounded"
          className="flex-auto bg-gray-400"
          onClick={close}
          disabled={isApproving}
        >
          CANCEL
        </Button>
        <Button
          shape="rounded"
          className="ml-4 flex-auto"
          onClick={handleApprove}
          isLoading={isApproving}
        >
          APPROVE
        </Button>
      </div>
    </>
  )
}
