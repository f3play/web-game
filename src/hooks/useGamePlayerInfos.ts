import { TournamentContract } from "@/config/contracts"
import { Address, useContractRead } from "wagmi"

export const useGamePlayerInfo = (account: Address, round: number) => {
  const { data: playerInfo, refetch } = useContractRead({
    ...TournamentContract,
    functionName: "playerInfo",
    args: [account, round],
  })

  return {
    data: playerInfo,
    refetch,
  }
}
