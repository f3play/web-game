import { formatTokenAmountString } from "@/utils/strings"

export type TournamentInfo = {
  poolReward: string
  totalRound: number
  currentRound: number
  tournamentReward: string
  startTime: number
  endTime: number
  roundDuration: number
  totalPlayers: number
}

export const tournamentInfoFromData = (data: any): TournamentInfo => {
  if (!data) {
    return {
      poolReward: "0",
      totalRound: 0,
      currentRound: 0,
      tournamentReward: "0",
      startTime: 0,
      endTime: 0,
      roundDuration: 0,
      totalPlayers: 0,
    }
  }

  return {
    poolReward: data.poolReward.toString(),
    totalRound: Number(data.totalRound),
    currentRound: Number(data.currentRound),
    tournamentReward: formatTokenAmountString(data.tournamentReward),
    startTime: Number(data.startTime),
    endTime: Number(data.endTime),
    roundDuration: Number(data.roundDuration),
    totalPlayers: Number(data.totalPlayers),
  }
}
