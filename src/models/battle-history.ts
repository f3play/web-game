import { heroFromAttributes } from "./hero"

export type BattleHistory = {
  attacker: string
  defender: string
  result: boolean
  playedAt: number
  attackerScoreChange: number
  defenderScoreChange: number
  attackerSquad: any[]
  defenderSquad: any[]
}

export const battleHistoryFromData = (data: any) => {
  return {
    attacker: data.attacker,
    defender: data.defender,
    result: data.result,
    playedAt: Number(data.playedAt),
    attackerScoreChange: Number(data.attackerScoreChange),
    defenderScoreChange: Number(data.defenderScoreChange),
    attackerSquad: data.attackerSquad?.map((i: any) =>
      heroFromAttributes(i.id, i.attribute),
    ),
    defenderSquad: data.defenderSquad?.map((i: any) =>
      heroFromAttributes(i.id, i.attribute),
    ),
  }
}
