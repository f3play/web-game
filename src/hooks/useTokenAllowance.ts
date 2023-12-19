import PandaTokenABI from "@/config/abis/PandaToken"
import { Address, useContractRead } from "wagmi"
import {BusdTokenAddress} from "@/config/contracts";
import {ZERO_ADDRESS} from "@/utils";

export default function useTokenAllowance(
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
  watch: boolean = false,
) {
  const { data, ...res } = useContractRead({
    address: tokenAddress,
    abi: PandaTokenABI,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
    watch,
  })

  return { allowance: data, ...res }
}
