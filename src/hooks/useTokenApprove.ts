import PandaTokenABI from "@/config/abis/PandaToken"
import { Address, usePrepareContractWrite } from "wagmi"
import { useContractWriteAndWait } from "."

export default function useTokenApprove(
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
) {
  const res = usePrepareContractWrite({
    address: tokenAddress,
    abi: PandaTokenABI,
    functionName: "approve",
    args: [spender, amount],
  })

  return useContractWriteAndWait(res)
}
