import { useState } from "react"
import { useAccount } from "wagmi"
import { prepareWriteContract } from "wagmi/actions"

import Button, { ButtonProps } from "@/components/ui/button"
import { BusdTokenAddress, MarketplaceContract } from "@/config/contracts"
import { useModalContext } from "@/hooks/useModal"
import useTokenAllowance from "@/hooks/useTokenAllowance"
import { HeroListing } from "@/models/hero"
import { ApproveTokenModal, ApproveTokenResult } from "./approve-token-modal"
import { toast } from "react-hot-toast"
import { waitForContractWrite } from "@/utils/contract"
import { ZERO_ADDRESS } from "@/utils"

interface BuyButtonProps {
  listing: HeroListing
  onSuccess?: () => void
}

export default function BuyButton({
  listing,
  onSuccess,
  ...rest
}: BuyButtonProps & ButtonProps) {
  const { address } = useAccount()
  const { open: openModal } = useModalContext()
  const [isBuying, setIsBuying] = useState(false)

  const { allowance } = useTokenAllowance(
    BusdTokenAddress,
    address!,
    MarketplaceContract.address,
  )

  const approved = !!allowance && allowance >= listing.price

  async function buy() {
    setIsBuying(true)

    try {
      const config = await prepareWriteContract({
        ...MarketplaceContract,
        functionName: "buy",
        args: [listing.id],
        value: BusdTokenAddress === ZERO_ADDRESS ? listing.price : 0,
      })
      const res = await waitForContractWrite(config)
      if (res && res.status === "success") onSuccess?.()
    } catch (err: any) {
      toast.error(err.shortMessage || err.message)
    } finally {
      setIsBuying(false)
    }
  }

  async function handleBuy(event: any) {
    event.stopPropagation()

    if (!approved && BusdTokenAddress !== ZERO_ADDRESS) {
      const res = await openModal<ApproveTokenResult>(
        <ApproveTokenModal price={listing.price} />,
        {
          title: `BUY HERO #${listing.nftIds[0]}`,
          dismissable: false,
        },
      )
      if (!res || !res.approved) return
    }
    buy()
  }

  return (
    <>
      <Button
        shape="rounded"
        variant="solid"
        className="dark:bg-green-600"
        onClick={handleBuy}
        isLoading={isBuying}
        {...rest}
      >
        BUY
      </Button>
    </>
  )
}
