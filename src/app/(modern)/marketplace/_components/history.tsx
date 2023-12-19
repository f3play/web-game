"use client"

import { MKP_HERO_PER_PAGE, MKP_TRADE_PER_PAGE } from "@/config"
import { MarketplaceABI } from "@/config/abis"
import { MarketplaceContract } from "@/config/contracts"
import dayjs from "dayjs"
import { useState } from "react"
import { useContractRead } from "wagmi"
import TradeTable from "./trade-table"

export default function MarketplaceHistory() {
  const [page, setPage] = useState(1)
  const { data } = useContractRead({
    ...MarketplaceContract,
    functionName: "recentTrades",
    args: [BigInt((page - 1) * MKP_TRADE_PER_PAGE), BigInt(MKP_TRADE_PER_PAGE)],
  })

  const total = Number(data?.[0] || 0)
  const totalPage = Math.ceil(total / MKP_TRADE_PER_PAGE)

  return (
    <TradeTable
      data={data?.[1] || []}
      currentPage={page}
      setCurrentPage={setPage}
      totalPage={totalPage}
    />
  )
}
