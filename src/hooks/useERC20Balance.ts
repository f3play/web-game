import PandaTokenABI from "@/config/abis/PandaToken"
import { Address, useContractRead } from "wagmi"

export const useERC20Balance = (erc20: Address, owner: Address) => {
  const data = useContractRead({
    address: erc20,
    abi: PandaTokenABI,
    functionName: "balanceOf",
    args: [owner],
    enabled: !!erc20 && !!owner,
  })

  return {
    data: data.data,
    refetch: data.refetch,
  }
}
