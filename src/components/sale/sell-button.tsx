import { useAccount } from "wagmi"

import Button, { ButtonProps } from "@/components/ui/button"
import { MarketplaceAddress } from "@/config/contracts"
import { useHeroIsApprovedForAll } from "@/hooks/hero"
import { useModalContext } from "@/hooks/useModal"
import { ApproveNFTModal, ApproveNFTResult } from "./approve-nft-modal"
import { SellModal, SellResult } from "./sell-modal"

interface SellButtonProps {
  heroId: bigint
  onSuccess?: () => void
}

export default function SellButton({
  heroId,
  onSuccess,
  ...rest
}: SellButtonProps & ButtonProps) {
  const { address } = useAccount()
  const { open: openModal } = useModalContext()

  const { isApprovedForAll } = useHeroIsApprovedForAll(
    address,
    MarketplaceAddress,
  )

  async function handleSell(event: any) {
    event.stopPropagation()

    if (!isApprovedForAll) {
      const res = await openModal<ApproveNFTResult>(<ApproveNFTModal />, {
        title: `SELL HERO #${heroId}`,
        dismissable: false,
      })
      if (!res || !res.approved) return
    }

    const res = await openModal<SellResult>(<SellModal heroId={heroId} />, {
      title: `SELL HERO #${heroId}`,
      dismissable: false,
    })
    if (res && res.sold) return onSuccess?.()
  }

  return (
    <Button
      shape="rounded"
      variant="solid"
      className="dark:bg-red-500"
      onClick={handleSell}
      {...rest}
    >
      SELL
    </Button>
  )
}
