import { ethers } from "ethers"
import { useState } from "react"
import { TransactionExecutionError } from "viem"
import { prepareWriteContract } from "wagmi/actions"

import Button from "@/components/ui/button"
import TokenInput from "@/components/ui/token-input"
import {ERC20_DISPLAY_DECIMALS, ERC20_SYMBOL, PAYMENT_TOKEN} from "@/config"
import { MarketplaceContract } from "@/config/contracts"
import { useModalContext } from "@/hooks/useModal"
import { waitForContractWrite } from "@/utils/contract"

export type SellResult = {
  price?: bigint
  heroId?: bigint
  sold: boolean
}

export const SellModal = ({ heroId }: { heroId: bigint }) => {
  const { close, resolve } = useModalContext()
  const [isSelling, setIsSelling] = useState(false)
  const [error, setError] = useState<
    (Error & TransactionExecutionError) | undefined
  >()

  const [price, setPrice] = useState("0")
  const parsedPrice = ethers.parseEther(price || "0")

  async function handleSell() {
    setIsSelling(true)
    setError(undefined)

    try {
      const config = await prepareWriteContract({
        ...MarketplaceContract,
        functionName: "list",
        args: [[heroId], parsedPrice],
      })
      const res = await waitForContractWrite(config)
      if (res && res.status === "success") {
        resolve<SellResult>({ sold: true, heroId, price: parsedPrice })
      }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsSelling(false)
    }
  }

  return (
    <div className="w-96">
      <label>
        <p className="mb-4">Input your price</p>
        <TokenInput
          value={price}
          onChange={setPrice}
          symbol={PAYMENT_TOKEN}
          displayDecimals={ERC20_DISPLAY_DECIMALS}
        />
      </label>
      {error && (
        <p className="mt-4 text-sm text-red-500">{error.shortMessage}</p>
      )}
      <div className="mt-4 flex w-full">
        <Button
          shape="rounded"
          className="flex-auto bg-gray-400"
          onClick={close}
          disabled={isSelling}
        >
          CANCEL
        </Button>
        <Button
          shape="rounded"
          className="ml-4 flex-auto bg-red-500"
          onClick={handleSell}
          isLoading={isSelling}
          disabled={parsedPrice === BigInt(0)}
        >
          SELL
        </Button>
      </div>
    </div>
  )
}
