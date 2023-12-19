import {
  MultiviewContract,
  PandaNFTAddress,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { battleHistoryFromData } from "@/models/battle-history"
import { Address, useContractRead, useContractReads } from "wagmi"

export const useGameBattleHistoryCount = (player: Address) => {
  const { data, refetch } = useContractRead({
    ...TournamentContract,
    functionName: "battleHistoryCounter",
    args: [player],
    enabled: !!player,
  })

  return {
    data,
    refetch,
  }
}

export const useGameBattleHistory = (
  player: Address,
  offset: bigint,
  limit: bigint,
) => {
  const { data, refetch } = useContractRead({
    ...MultiviewContract,
    functionName: "battleHistory",
    args: [TournamentAddress, PandaNFTAddress, player, offset, limit],
  })

  return {
    data: data?.map((i: any) => battleHistoryFromData(i)) || [],
    refetch,
  }
}

export const getAllBattleHistory = (player: Address) => {
  const { data: battleCount } = useGameBattleHistoryCount(player)

  let limit = 50

  const calls = []
  for (let i = 0; i < battleCount; i = i + limit) {
    calls.push({
      ...MultiviewContract,
      functionName: "battleHistory",
      args: [TournamentAddress, PandaNFTAddress, player, i, limit],
    })
  }

  const { data: battlesData, refetch: refetchList } = useContractReads({
    contracts: calls,
  })

  const battles =
    battlesData?.reduce((a, b) => {
      let battles = b.result?.map((i: any) => battleHistoryFromData(i)) || []
      a?.push(...battles)
      return a
    }, []) || []

  return {
    data: battles,
    refetch: refetchList,
  }
}
