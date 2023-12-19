"use client"

import React, { useEffect, useState } from "react"
import { BattleHistory } from "@/models/battle-history"
import HistoryTable from "@/components/battle/history/history-table"
import { useAccount } from "wagmi"
import {
  getAllBattleHistory,
} from "@/hooks/useGameBattleHistory"

export default function BattleHistory() {
  let [histories, setHistories] = useState<BattleHistory[]>([])

  const { address } = useAccount()
  const { data: battleHistory } = getAllBattleHistory(address)

  useEffect(() => {
    const newDataCheck = battleHistory?.map((i) => i.playedAt.toString())
    const oldDataCheck = histories?.map((i) => i.playedAt.toString())

    if (JSON.stringify(newDataCheck) != JSON.stringify(oldDataCheck)) {
      setHistories([...battleHistory])
    }
  }, [battleHistory])

  return (
    <>
      <HistoryTable data={histories} address={address} />
    </>
  )
}
