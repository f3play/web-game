import { TournamentContract } from "@/config/contracts"
import { Address, useContractRead } from "wagmi"

export const useGameBattle = (account: Address) => {
  const { data } = useContractRead({
    ...TournamentContract,
    functionName: "battle",
  })

  return data
}
