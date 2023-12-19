import { formatTokenAmountString } from "@/utils/strings"

export type RoundInfo = {
  startTime: number
  endTime: number
  totalPlayers: number
  rewards: string
}

export const roundInfoFromData = (data: any): RoundInfo => {
  if (!data) {
    return {
      startTime: 0,
      endTime: 0,
      totalPlayers: 0,
      rewards: "0",
    }
  }

  return {
    startTime: Number(data.startTime),
    endTime: Number(data.endTime),
    totalPlayers: Number(data.totalPlayers),
    rewards: formatTokenAmountString(data.rewards.toString()),
  }
}
