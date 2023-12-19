import { TournamentContract } from "@/config/contracts"
import { opponentFromData } from "@/models/opponent"
import { Address, useContractRead } from "wagmi"

export const useGameOpponent = (account: Address) => {
  const { data: opponent, refetch } = useContractRead({
    ...TournamentContract,
    functionName: "opponent",
    args: [account],
  })

  return {
    data: opponentFromData(opponent),
    refetch,
  }
}

export const useGameRerollPrice = () => {
  const { data: rerollPrice } = useContractRead({
    ...TournamentContract,
    functionName: "REROLL_OPPONENT_COST",
  })

  return rerollPrice
}

export const useGameBattleCost = (account: Address) => {
  const { data: battleCost } = useContractRead({
    ...TournamentContract,
    functionName: "battleCost",
    account: account,
  })

  return battleCost
}
