import { Address, useContractRead } from "wagmi"
import * as BN from "bn.js"
import { PandaTokenContract } from "@/config/contracts"

export const useERC20ApprovalStatus = (
  owner: Address,
  spender: Address,
  amount: string,
) => {
  const requireAmount = new BN(amount)

  const { data: amountApproved } = useContractRead({
    ...PandaTokenContract,
    functionName: "allowance",
    args: [owner, spender],
    enabled: !!owner,
    watch: true,
  })

  const allowed = new BN(amountApproved)

  return allowed.gte(requireAmount)
}
