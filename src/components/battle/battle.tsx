"use client"

import { use, useEffect, useState } from "react"
import ChooseHeroesDialog from "@/components/battle/choose-heroes-dialog"
import Button from "@/components/ui/button"
import classNames from "classnames"
import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { ADDRESS_0 } from "@/utils/tournament"
import { useGameBattleCost, useGameOpponent } from "@/hooks/useGameOpponent"
import { ethers } from "ethers"
import BattlePlayerInfo from "./battle-player-info"
import Image from "next/image"
import { useGameCurrentRound } from "@/hooks/useGameRoundInfo"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import { formatTokenAmountString, numberWithCommas } from "@/utils/strings"
import Game from "../game/game"
import { useERC20ApprovalStatus } from "@/hooks/useERC20ApprovalStatus"
import {
  PandaTokenAddress,
  PandaTokenContract,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { useERC20Balance } from "@/hooks/useERC20Balance"

export default function Battle() {
  const { address: account } = useAccount()
  const router = useRouter()

  let [chooseLineUp, setChooseLineUp] = useState(false)

  const currentRound = useGameCurrentRound()
  const { data: opponent, refetch: refetchOpponent } = useGameOpponent(account)
  const { data: playerInfo, refetch: refetchPlayerInfo } = useGamePlayerInfo(
    account,
    currentRound,
  )
  const [battleText, setBattleText] = useState("battle")
  const battleCost = useGameBattleCost(account)
  const { data: f3Balance } = useERC20Balance(PandaTokenAddress, account)

  const freeTurns = () => {
    if (!playerInfo) {
      return 0
    }

    const result = 5 - Number(playerInfo.battleCount)
    return result > 0 ? result : 0
  }

  const isApprove = useERC20ApprovalStatus(
    account,
    TournamentAddress,
    battleCost,
  )

  const checkBattleText = () => {
    if (!isApprove) {
      setBattleText("approve")
    }
  }

  const refetchData = () => {
    refetchOpponent()
  }

  const backToPreviousPage = () => {
    router.back()
  }

  // define approve erc20
  const { config: approveERC20Config } = usePrepareContractWrite({
    ...PandaTokenContract,
    functionName: "approve",
    args: [TournamentAddress, ethers.MaxUint256],
  })

  const { data: approveData, write: callApproveERC20 } =
    useContractWrite(approveERC20Config)

  const { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: (receipt) => {
      if (receipt.status == "success") {
        toast.success("Approve successfully")
      } else {
        toast.error("Failed to approve")
      }
    },
    onError: (error) => {
      console.log("approve error", error)
      toast.error("Failed to approve")
    },
  })
  // end approve erc20

  //define call battle
  const { config: callBattleConfig } = usePrepareContractWrite({
    ...TournamentContract,
    functionName: "battle",
  })

  const { data: battleData, write: callBattle } =
    useContractWrite(callBattleConfig)

  const { isLoading: battleLoading } = useWaitForTransaction({
    hash: battleData?.hash,
    onSuccess: async (receipt) => {
      //TODO: handle result
      console.log("receipt", receipt)
    },
    onError: (error) => {
      console.log("error", error)
    },
  })

  const onSubmitBattle = () => {
    if (!isApprove) {
      return callApproveERC20()
    }

    if (f3Balance < battleCost) {
      return toast.error("Insufficient Balance")
    }

    return callBattle()
  }

  if (battleData) {
    return (
      <Game
        txHash={battleData?.hash}
        account={account}
        opponent={opponent.address}
        round={currentRound}
      ></Game>
    )
  }

  // end call battle
  return (
    <div className="mx-auto w-full rounded-lg text-sm uppercase">
      <div className="w-full pt-[32px] text-center text-3xl font-semibold">
        BATTLE ARENA
      </div>
      <div className="grid grid-cols-7 3xl:grid-cols-11">
        <BattlePlayerInfo
          address={account}
          className={"col-span-3 3xl:col-span-5"}
          round={currentRound}
        ></BattlePlayerInfo>
        <div className="col-span-1 flex h-full flex-col">
          <>
            <Image
              shape={"rounded"}
              src={"/assets/Icon/fight.svg"}
              className="mx-auto mb-[16px] mt-[126px]"
              alt={""}
              width={100}
              height={50}
            />
          </>
          <div className="grow"></div>
          <div className="mt-[64px] w-full place-self-center">
            <div className="mb-[8px] text-center font-semibold text-orange-500">
              {freeTurns()} free {freeTurns() > 1 ? "turns" : "turn"}
            </div>
            <div className="flex w-full items-center">
              {freeTurns() > 0 ? (
                <>
                  <Button
                    shape={"rounded"}
                    className={"mx-auto flex w-full max-w-[140px]"}
                    onClick={() => {
                      callBattle()
                    }}
                    size="mini"
                    isLoading={battleLoading}
                  >
                    Battle
                  </Button>
                </>
              ) : (
                <Button
                  shape={"rounded"}
                  className={"mx-auto flex w-full max-w-[140px]"}
                  onClick={onSubmitBattle}
                  onMouseEnter={() => {
                    checkBattleText()
                  }}
                  onMouseLeave={() => {
                    setBattleText("battle")
                  }}
                  size="mini"
                  isLoading={battleLoading || approveLoading}
                  disabled={battleLoading || approveLoading}
                >
                  {battleText != "approve" ? (
                    <div className="flex w-full">
                      <span className="mr-[8px] mt-[2px]">Battle</span>
                      <div className="flex">
                        <Image
                          src={"/assets/Icon/logo.svg"}
                          alt={""}
                          className="mr-[2px]"
                          width={20}
                          height={4}
                        />
                        <h3 className=" mt-[2px]">
                          {numberWithCommas(
                            parseInt(
                              formatTokenAmountString(
                                battleCost?.toString() || "0",
                              ),
                            ),
                          )}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div>Approve</div>
                  )}
                </Button>
              )}
            </div>

            <div className="flex w-full items-center">
              <Button
                shape={"rounded"}
                className={
                  "mx-auto mb-[16px] mt-[12px] flex w-full max-w-[140px]"
                }
                onClick={() => {
                  backToPreviousPage()
                }}
                size="mini"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
        <BattlePlayerInfo
          address={opponent ? opponent.address : ADDRESS_0}
          isOpponent={true}
          className={"col-span-3 3xl:col-span-5"}
          round={currentRound}
        ></BattlePlayerInfo>
      </div>
      <ChooseHeroesDialog
        isOpen={chooseLineUp}
        setIsOpen={setChooseLineUp}
        refetch={refetchData}
      />
    </div>
  )
}
