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
import { LongArrowRight } from "@/components/icons/long-arrow-right"
import { LongArrowLeft } from "@/components/icons/long-arrow-left"
import classNames from "classnames"
import { PlayerRankInfo, playerRankInfoFromData } from "@/models/playerRankInfo"
import {
  useGamePlayerRank,
  useGameRoundInfo,
  useGameRoundRanking,
  useGameTournamentInfo,
} from "@/hooks/useGameRoundInfo"
import { shortAddress } from "@/utils/strings"
import CountdownTimer from "./game-countdown"
import MiniNft from "@/app/shared/mini-nft"
import { useAccount } from "wagmi"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import TokenAmount from "@/app/shared/token-amount"
import { TokenConfig } from "@/config/tokens"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { ADDRESS_0 } from "@/utils/tournament"
import {AddressHyperLink} from "@/components/ui/scan-hyperlink";

const COLUMNS = [
  {
    Header: "RANK",
    accessor: "rank",
    minWidth: 40,
    maxWidth: 50,
    Cell: ({ cell: { value } }) => (
      <p className="text-center">{!!value ? value : "-"}</p>
    ),
    Header: () => <p className="text-center">RANK</p>,
  },
  {
    Header: "PLAYER",
    accessor: "player",
    minWidth: 70,
    maxWidth: 80,
    Cell: ({ cell: { value } }) => <AddressHyperLink address={value}/> ,
  },
  {
    Header: "SQUAD",
    accessor: "squad",
    minWidth: 60,
    maxWidth: 70,
    Cell: ({ cell: { value } }) => (
      <div className={"flex h-[50px] items-center justify-start gap-2"}>
        {!!value.length
          ? value.map((item, idx) => (
              <MiniNft
                className={"w-[34px]"}
                key={idx}
                nftId={item.toString()}
              />
            ))
          : [0, 0, 0].map((item, idx) => (
              <MiniNft
                key={idx}
                nftId={item.toString()}
                className={"w-[34px]"}
              />
            ))}
      </div>
    ),
  },
  {
    Header: "SCORE",
    accessor: "score",
    minWidth: 30,
    maxWidth: 40,
    Cell: ({ cell: { value } }) => (
      <p className="text-center">{value.toString()}</p>
    ),
    Header: () => <p className="text-center">SCORE</p>,
  },
  {
    Header: "REWARD",
    accessor: "reward",
    minWidth: 30,
    maxWidth: 40,
    Cell: ({ cell: { value } }) => (
      <TokenAmount tokenConfig={TokenConfig.BUSD} amount={value}></TokenAmount>
    ),
    Header: () => <p className="text-center">REWARD</p>,
  },
]

export default function RoundRanking({
  round,
  refresh,
  tournamentStarted = false
}: {
  round: number
  refresh: boolean
  tournamentStarted: boolean
}) {
  const { address: account } = useAccount()
  const roundInfo = useGameRoundInfo(!round ? 1 : round)
  const tournamentInfo = useGameTournamentInfo()
  const players = useGameRoundRanking(round)
  const { data: playerInfo, refetch: refetchPlayerInfo } = useGamePlayerInfo(
    account,
    round,
  )
  const playerRank = useGamePlayerRank(account, round)

  const [player, setPlayer] = useState<PlayerRankInfo>(null)

  let [data, setData] = useState<PlayerRankInfo[]>([])
  useEffect(() => {
    let playerRankData = playerRankInfoFromData(
      playerRank,
      playerInfo,
      round == 0 ? tournamentInfo.tournamentReward : roundInfo.rewards,
      players,
    )

    if (JSON.stringify(playerRankData) != JSON.stringify(player)) {
      setPlayer(
        playerRankInfoFromData(
          playerRank,
          playerInfo,
          round == 0 ? tournamentInfo.tournamentReward : roundInfo.rewards,
          players,
        ),
      )
    }

    const allPlayers = !players?.length
      ? [playerRankData]
      : [...players.slice(0, 100)]
    if (JSON.stringify(allPlayers) != JSON.stringify(data)) {
      setData([...allPlayers])
    }
  }, [players, playerInfo, playerRank])

  useEffect(() => {
    refetchPlayerInfo()
  }, [refresh])

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
      data: data,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
  )

  const { pageIndex } = state

  const router = useRouter()

  const playerRow = () => {
    {
      if (page.length == 0) {
        return <></>
      }
      let row = page[0]
      prepareRow(row)
      return (
        <tr
          {...row.getRowProps()}
          className={classNames(
            "mb-3 items-center rounded-lg bg-white shadow-card last:mb-0 dark:bg-light-dark",
            "border-2 border-amber-500/50 bg-gradient-radial from-amber-800/10 from-40% to-amber-800/80",
          )}
        >
          <td
            {...row.cells[0].getCellProps()}
            className={classNames(
              "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
            )}
          >
            <p className="text-center">{player?.rank || "-"}</p>
          </td>
          <td
            {...row.cells[1].getCellProps()}
            className={classNames(
              "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
            )}
          >
           <AddressHyperLink address={player?.player || ADDRESS_0}/>
          </td>
          <td
            {...row.cells[2].getCellProps()}
            className={classNames(
              "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
            )}
          >
            <div className={"flex h-[50px] items-center justify-start gap-2"}>
              {!!player?.squad.length
                ? player?.squad.map((item, idx) => (
                    <MiniNft
                      className={"w-[34px]"}
                      key={idx}
                      nftId={item.toString()}
                    />
                  ))
                : [0, 0, 0].map((item, idx) => (
                    <MiniNft
                      key={idx}
                      nftId={item.toString()}
                      className={"w-[34px]"}
                    />
                  ))}
            </div>
          </td>
          <td
            {...row.cells[3].getCellProps()}
            className={classNames(
              "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
            )}
          >
            <p className="text-center">{player?.score.toString()}</p>
          </td>
          <td
            {...row.cells[4].getCellProps()}
            className={classNames(
              "px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8",
            )}
          >
            <TokenAmount
              tokenConfig={TokenConfig.BUSD}
              amount={player?.reward || 0}
            ></TokenAmount>
          </td>
        </tr>
      )
    }
  }

  return (
    <div className="">
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-8 pt-8 dark:bg-light-dark">
        <div className="items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <div className=" w-full">
            <div
              className={classNames(
                "grid grid-cols-12",
                round == 0 ? "" : "mb-[4px]",
              )}
            >
              <h2 className="col-span-4  grow text-left text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:text-xl">
                {round == 0
                  ? "TOURNAMENT"
                  : `Round ${round}/${tournamentInfo.totalRound}`}
              </h2>
              {/* <div>
                <FontAwesomeIcon
                  icon="fa-solid fa-clock-rotate-left"
                  className={"h-6 w-6"}
                />
              </div> */}
              {round != 0 ? (
                <>
                  <div className="col-span-4 mb-[4px] self-end text-center">
                    <TokenAmount
                      className="justify-center"
                      tokenConfig={TokenConfig.BUSD}
                      amount={roundInfo.rewards}
                    ></TokenAmount>
                  </div>
                  <div className={"col-span-4 self-end text-right"}>
                    <CountdownTimer
                      preText={tournamentStarted ? "ends in" : "starts in"}
                      size="small"
                      targetDate={tournamentStarted ? roundInfo.endTime * 1000 : roundInfo.startTime * 1000}
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-8 flex justify-end">
                  <Button
                    shape={"circle"}
                    variant={"transparent"}
                    onClick={() => router.push("/tournament/battle-history")}
                    size="mini"
                  >
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      className={"h-6 w-6"}
                      color="white"
                    />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: "100%" }} autoHide="never" className="">
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-base text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column
                          .getHeaderProps
                          //   column.getSortByToggleProps(),
                          ()}
                        key={idx}
                        className="group bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="items-center">
                          {column.render("Header")}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? "isResizing" : ""
                              }`}
                            />
                          )}
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
                {playerRow()}
                {players?.length ? (
                  page.map((row, idx) => {
                    prepareRow(row)
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={idx}
                        className={classNames(
                          "mb-3 items-center rounded-lg bg-white shadow-card last:mb-0 dark:bg-light-dark",
                        )}
                      >
                        {row.cells.map((cell, idx) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              key={idx}
                              className="px-2 py-2 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4  md:ltr:first:pl-8 md:ltr:last:pr-8"
                            >
                              {cell.render("Cell")}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                ) : (
                  <></>
                )}
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
