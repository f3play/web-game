import { prepareWriteContract } from "@wagmi/core"
import { useState } from "react"
import { toast } from "react-hot-toast"

import Button, { ButtonProps } from "@/components/ui/button"
import { MarketplaceContract } from "@/config/contracts"
import { waitForContractWrite } from "@/utils/contract"
import {usePathname, useRouter} from "next/navigation";

interface UnlistButtonProps {
  listingId: bigint
  onSuccess?: () => void
}

export default function UnlistButton({
  listingId,
  onSuccess,
  ...rest
}: UnlistButtonProps & ButtonProps) {
  const [unlisting, setUnlisting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function handleUnlist() {
    setUnlisting(true)

    try {
      const config = await prepareWriteContract({
        ...MarketplaceContract,
        functionName: "unlist",
        args: [listingId],
      })
      const res = await waitForContractWrite(config)
      if (res && res.status === "success") {
        onSuccess?.()
      }
    } catch (err: any) {
      toast.error(err.shortMessage || err.message)
    } finally {
      setUnlisting(false)
    }
  }

  return (
    <Button
      shape="rounded"
      variant="solid"
      className="dark:bg-yellow-600"
      onClick={handleUnlist}
      isLoading={unlisting}
      {...rest}
    >
      UNLIST
    </Button>
  )
}
