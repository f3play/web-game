import { TournamentContract } from "@/config/contracts"
import { playerRankInfoFromData } from "@/models/playerRankInfo"
import { Address, useContractRead } from "wagmi"
import { roundInfoFromData } from "@/models/roundInfo"
import { tournamentInfoFromData } from "@/models/tournamentInfo"

export const useGameCurrentRound = () => {
  const { data } = useContractRead({
    ...TournamentContract,
    functionName: "currentRound",
  })

  return data
}

export const useGameRoundInfo = (round: number) => {
  const { data } = useContractRead({
    ...TournamentContract,
    functionName: "roundInfo",
    args: [BigInt(round)],
    watch: true,
  })

  return roundInfoFromData(data)
}

export const useGameTournamentInfo = () => {
  const { data } = useContractRead({
    ...TournamentContract,
    functionName: "tournamentInfo",
    watch: true,
  })
  return tournamentInfoFromData(data)
}

export const useGameRoundRanking = (round: number) => {
  const topPlayer1 = useGameRanking(round, 0, 100)
  const topPlayer2 = useGameRanking(round, 100, 50)
  const topPlayer = topPlayer1?.concat(topPlayer2 || []) || []

  if (!topPlayer) {
    return []
  }

  const playerRank = topPlayer.sort(
    (a, b) => parseInt(b.score.toString()) - parseInt(a.score.toString()),
  )

  const roundInfo = useGameRoundInfo(!round ? 1 : round)
  const tournamentInfo = useGameTournamentInfo()

  return playerRank.map((item, idx) =>
    playerRankInfoFromData(
      idx + 1,
      item,
      parseFloat(
        round == 0 ? tournamentInfo.tournamentReward : roundInfo.rewards,
      ),
      playerRank,
    ),
  )
}

export const useGameRanking = (
  round: number,
  offset: number,
  limit: number,
) => {
  const { data } = useContractRead({
    ...TournamentContract,
    functionName: "roundRanks",
    args: [round, offset, limit],
  })

  return data
}

export const useGamePlayerRank = (account: Address, round: number) => {
  const playerRank = useGameRoundRanking(round)

  return (
    playerRank.findIndex(
      (i) =>
        i.player.toString().toLowerCase() == account.toString().toLowerCase(),
    ) + 1
  )
}
