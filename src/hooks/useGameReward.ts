import { TournamentContract } from "@/config/contracts"
import { formatTokenAmountString } from "@/utils/strings"
import { Address, useContractRead } from "wagmi"

export const useGameRewardClaimable = (account: Address) => {
  const { data, refetch } = useContractRead({
    ...TournamentContract,
    functionName: "claimable",
    args: [account],
    enabled: !!account,
  })

  return {
    data: data ? formatTokenAmountString(data.toString()) : "0",
    refetch,
  }
}
