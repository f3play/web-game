"use client"

import React, { useEffect, useState } from "react"
import {
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table"
import Button from "@/components/ui/button"
import Scrollbar from "@/components/ui/scrollbar"
import { ChevronDown } from "@/components/icons/chevron-down"
import { LongArrowRight } from "@/components/icons/long-arrow-right"
import { LongArrowLeft } from "@/components/icons/long-arrow-left"
import { useQuery } from "react-query"
import { NFTS_RANKING, NFTS_YOUR_RANK } from "@/utils/constants"
import { GetRanking } from "@/hooks/dashboard"
import { Rank } from "@/models/rank"
import { useGamePlayers } from "@/hooks/useGamePlayerInfos"
import { shortAddress } from "@/utils/strings"
import { Poppins } from "next/font/google"
import classNames from "classnames"
import Image from "next/image"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const COLUMNS = [
  {
    Header: "RANK",
    accessor: "rank",
    minWidth: 10,
    maxWidth: 10,
    Cell: ({ cell: { value } }) => (
      <div className="grid justify-items-center text-left">
        {(value <= 3 && (
          <Image
            src={"/assets/Icon/medal-" + value + ".svg"}
            alt={"medal"}
            height={30}
            width={30}
          />
        )) || <p className={"text-center"}>{value}</p>}
        {/*{(value <= 3) && <Image src={'/assets/Icon/medal-' + value +'svg'} alt={'medal'} height={5} width={5} /> || {value}}*/}
      </div>
    ),
  },
  {
    Header: "ADDRESS",
    accessor: "address",
    minWidth: 60,
    maxWidth: 80,
  },
  {
    Header: "ARENA POINT",
    accessor: "round_score",
    minWidth: 60,
    maxWidth: 80,
  },
  {
    Header: "BATTLE POINT",
    accessor: "tournament_score",
    minWidth: 60,
    maxWidth: 80,
  },
  {
    Header: "4H Reward",
    accessor: "round_reward",
    minWidth: 60,
    maxWidth: 80,
  },
  {
    Header: "Tournament Reward",
    accessor: "tournament_reward",
    minWidth: 60,
    maxWidth: 80,
  },
]

export default function RankingTable() {
  let [data, setData] = useState<Rank[]>([])
  const rankingData = useQuery([NFTS_RANKING], () => GetRanking, {
    onSuccess: (result) => {
      setData(result)
    },
  })
  let [ranking, setRanking] = useState<Rank[]>([])
  // const topPlayers = useGamePlayers(1, 10);
  const topPlayers = []

  useEffect(() => {
    if (!topPlayers) return
    let newRanking = topPlayers.map((player: any, index: number) => {
      // return Rank
      return {
        rank: index + 1,
        address: shortAddress(player.player),
        round_score: player.score.toString(),
        tournament_score: "-",
        round_reward: "-",
        tournament_reward: "-",
      }
    })
    setRanking(newRanking)
  }, [])

  console.log("topPlayeres", topPlayers)

  const columns = React.useMemo(() => COLUMNS, [])

  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data: ranking,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
  )

  const { pageIndex } = state

  return (
    <div className="">
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
        <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
            Leaderboard
          </h2>
        </div>
      </div>
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: "100%" }} autoHide="never" className="">
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-sm text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                        key={idx}
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? "isResizing" : ""
                              }`}
                            />
                          )}
                          <span className="ltr:ml-1 rtl:mr-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown />
                              ) : (
                                <ChevronDown className="rotate-180" />
                              )
                            ) : (
                              <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row)
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx}
                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 dark:bg-light-dark"
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
      <div className="mt-3 flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
        <div className="flex items-center gap-5">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            title="Previous"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
          </Button>
          <div>
            Page{" "}
            <strong className="font-semibold">
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </div>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            title="Next"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowRight className="h-auto w-4 rtl:rotate-180 " />
          </Button>
        </div>
      </div>
    </div>
  )
}
