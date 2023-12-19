import { ADDRESS_0 } from "@/utils/tournament"

export type PlayerRankInfo = {
  rank: number
  score: number
  battleCount: number
  player: string
  squad: number[]
  reward: number
}

export const playerRankInfoFromData = (
  rank: number,
  data: any,
  reward: string,
  players: any[],
): PlayerRankInfo => {
  let playerReward = getPlayerReward(rank, reward, players)
  const model = {
    rank: rank || 0,
    score: Number(data?.score) || 0,
    battleCount: Number(data?.battleCount) || 0,
    player: data?.player || ADDRESS_0,
    squad: data?.squad.map((i) => i.toString()) || [],
    reward: playerReward == 0 ? "0" : playerReward.toFixed(1),
  }

  return model
}

export const getPlayerReward = (
  rank: number,
  totalReward: number,
  players: any[],
) => {
  let percentReward = percentFromLength(rank)

  if (rank != 1 || players.length >= 100) {
    return (percentReward * totalReward) / 100
  }

  let rewards = 0
  for (let i = 1; i <= players.length; i++) {
    rewards += percentFromLength(i)
  }

  return ((percentReward + 100 - rewards) * totalReward) / 100
}

const percentFromLength = (rank: number) => {
  let percentReward = 0
  if (rank == 1) {
    percentReward = 16.23
  } else if (rank >= 2 && rank <= 10) {
    percentReward = 3.33
  } else if (rank > 10 && rank <= 20) {
    percentReward = 2
  }else if (rank > 20 && rank <= 50) {
    percentReward = 0.66
  } else if (rank > 50 && rank <= 100) {
    percentReward = 0.28
  }

  return percentReward
}
