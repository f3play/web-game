import { useState } from "react"
import { TransactionExecutionError } from "viem"
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions"

import Button from "@/components/ui/button"
import { MarketplaceAddress, PandaNFTContract } from "@/config/contracts"
import { useModalContext } from "@/hooks/useModal"
import { waitForContractWrite } from "@/utils/contract"

export type ApproveNFTResult = {
  approved: boolean
}

export const ApproveNFTModal = () => {
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState<
    (Error & TransactionExecutionError) | null
  >(null)

  const { close, resolve } = useModalContext()

  async function handleApprove() {
    setApproving(true)
    setError(null)

    try {
      const config = await prepareWriteContract({
        ...PandaNFTContract,
        functionName: "setApprovalForAll",
        args: [MarketplaceAddress, true],
      })
      const res = await waitForContractWrite(config)
      resolve<ApproveNFTResult>({ approved: res.status === "success" })
    } catch (err: any) {
      setError(err)
    } finally {
      setApproving(false)
    }
  }

  return (
    <>
      <p className="max-w-xl">
        Before initiating any trades, you need to authorize the Marketplace to
        access your Heroes.
      </p>
      {error && (
        <p className="mt-4 text-sm text-red-500">{error.shortMessage}</p>
      )}
      <div className="mt-4 flex w-full">
        <Button
          shape="rounded"
          className="flex-auto bg-gray-400"
          onClick={close}
          disabled={approving}
        >
          CANCEL
        </Button>
        <Button
          shape="rounded"
          className="ml-4 flex-auto"
          onClick={handleApprove}
          isLoading={approving}
        >
          APPROVE
        </Button>
      </div>
    </>
  )
}
