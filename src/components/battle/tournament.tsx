"use client"
import { useGameOpponent, useGameRerollPrice } from "@/hooks/useGameOpponent"
import RoundRanking from "./round-ranking"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import MiniNft from "@/app/shared/mini-nft"
import Button from "@/components/ui/button"
import ChooseHeroesDialog from "@/components/battle/choose-heroes-dialog"
import React, { useState } from "react"
import {
  useGameCurrentRound,
  useGameTournamentInfo,
} from "@/hooks/useGameRoundInfo"
import { useERC20ApprovalStatus } from "@/hooks/useERC20ApprovalStatus"
import {
  PandaTokenAddress,
  PandaTokenContract,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { ethers } from "ethers"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  formatTokenAmountString,
  numberWithCommas,
  shortAddress,
} from "@/utils/strings"
import CountdownTimer from "./game-countdown"
import TokenAmount from "@/app/shared/token-amount"
import { useGameRewardClaimable } from "@/hooks/useGameReward"
import { TokenConfig } from "@/config/tokens"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import { ADDRESS_0 } from "@/utils/tournament"
import { useERC20Balance } from "@/hooks/useERC20Balance"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClockRotateLeft} from "@fortawesome/free-solid-svg-icons";

export default function Tournament() {
  const router = useRouter()
  const { address: account } = useAccount()
  const currentRound = useGameCurrentRound()
  const { data: opponent, refetch: refetchOpponent } = useGameOpponent(account)
  const rerollPrice = useGameRerollPrice()
  const isApproveERC20 = useERC20ApprovalStatus(
    account,
    TournamentAddress,
    rerollPrice,
  )
  const tournamentInfo = useGameTournamentInfo()
  const [refreshRanking, setRefreshRanking] = useState(false)
  const { data: rewardClaimable, refetch: refetchRewardClaimable } =
    useGameRewardClaimable(account)

  const [rerollText, setRerollText] = useState("Reroll")
  let [chooseLineUp, setChooseLineUp] = useState(false)
  const { data: f3Balance } = useERC20Balance(PandaTokenAddress, account)

  const isJoined = () => {
    return opponent?.address != ADDRESS_0
  }

  const refetchData = () => {
    refetchOpponent()
    setRefreshRanking(!refreshRanking)
    refetchRewardClaimable()
  }

  const tournamentHasStarted = () => {
    const nowSecond = new Date().getTime() / 1000
    return tournamentInfo && nowSecond >= tournamentInfo.startTime
  }

  const navigateToBattle = () => {
    router.push("tournament/battle")
  }

  const checkRerollText = () => {
    if (!isApproveERC20) {
      setRerollText("Approve")
    }
  }

  //define reroll opponent call
  const { config: rerollConfig } = usePrepareContractWrite({
    ...TournamentContract,
    functionName: "rerollOpponent",
    enabled: isApproveERC20,
  })

  const { data, write: callRerollOpponent } = useContractWrite(rerollConfig)

  const { isLoading: rerollLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (receipt) => {
      if (receipt.status == "success") {
        toast.success("Reroll opponent successfully")
        refetchData()
      } else {
        toast.error("Failed to reroll opponent")
      }
    },
    onError: (error) => {
      toast.error("Failed to reroll opponent")
    },
  })
  // end enroll opponent call

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

  // define claim reward
  const { config: claimConfig } = usePrepareContractWrite({
    ...TournamentContract,
    functionName: "claimReward",
  })

  const { data: claimData, write: claimReward } = useContractWrite(claimConfig)

  const { isLoading: claimLoading } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess: (receipt) => {
      if (receipt.status == "success") {
        refetchRewardClaimable()
        toast.success("Claim reward successfully")
      } else {
        toast.error("Failed to claim reward")
      }
    },
    onError: (error) => {
      console.log("claim error", error)
      toast.error("Failed to claim reward")
    },
  })
  // end claim reward

  const onSubmitReroll = () => {
    if (!isApproveERC20) {
      return callApproveERC20()
    }

    if (f3Balance < rerollPrice) {
      return toast.error("Insufficient Balance")
    }

    return callRerollOpponent()
  }

  return (
    <div>
      <div className="mx-auto flex w-full gap-2 rounded border border-dashed border-gray-200 px-8 py-[16px] uppercase dark:border-gray-700 xl:text-sm">
        <div>
          <div className="flex">
            <h3 className="mr-[8px] text-2xl font-semibold">Tournament</h3>
            <CountdownTimer
              preText={tournamentHasStarted() ? "ends in" : "starts in"}
              className="mt-[12px] grow text-orange-500"
              size={"mini"}
              targetDate={
                (tournamentHasStarted()
                  ? tournamentInfo.endTime
                  : tournamentInfo.startTime) * 1000
              }
            ></CountdownTimer>
          </div>
          <div className="mt-[4px] mt-[8px] grid grid-cols-2">
            <div className="flex cursor-pointer">
              <UserGroupIcon
                width={20}
                height={20}
                className="mr-[4px]"
              ></UserGroupIcon>
              <span>{tournamentInfo.totalPlayers}</span>
            </div>
            <TokenAmount
              tokenConfig={TokenConfig.BUSD}
              amount={tournamentInfo.tournamentReward}
              className={"cursor-pointer"}
            ></TokenAmount>
          </div>
        </div>
        <div className="grow"></div>
        <div>
          <div className="grid grid-cols-5 gap-[8px]">
            <TokenAmount
              tokenConfig={TokenConfig.BUSD}
              className={"mr-[4px] mt-[4px] justify-end"}
              amount={rewardClaimable || 0}
            ></TokenAmount>
            <Button
              shape={"rounded"}
              className="w-[126px] uppercase"
              onClick={() => {
                claimReward()
              }}
              isLoading={claimLoading}
              disabled={rewardClaimable == "0"}
              size="mini"
            >
              CLAIM
            </Button>
            <Button
              shape={"rounded"}
              className="w-[126px] uppercase"
              onClick={() => {
                setChooseLineUp(true)
              }}
              size="mini"
            >
              PICK Squad
            </Button>
            <Button
              shape={"rounded"}
              className="w-[126px] px-0 uppercase"
              disabled={!isJoined() || !tournamentHasStarted()}
              onClick={() => {
                navigateToBattle()
              }}
              size="mini"
            >
              battle
            </Button>
            <Button
              shape={"rounded"}
              className="w-[126px]"
              onClick={onSubmitReroll}
              size="mini"
              onMouseEnter={() => {
                checkRerollText()
              }}
              onMouseLeave={() => {
                setRerollText("Reroll")
              }}
              disabled={!isJoined() || !tournamentHasStarted()}
              isLoading={approveLoading || rerollLoading}
            >
              {rerollText == "Approve" ? (
                <>{rerollText}</>
              ) : (
                <div className="flex">
                  <span className="mr-[16px] mt-[2px]">{rerollText}</span>
                  <div className="flex h-[20px] justify-center">
                    <Image
                      src={"/assets/Icon/logo.svg"}
                      alt={""}
                      className="mr-[2px]"
                      width={20}
                      height={20}
                    />
                    <h3 className="mt-[2px]">
                      {numberWithCommas(
                        parseInt(
                          formatTokenAmountString(
                            rerollPrice?.toString() || "0",
                          ),
                        ),
                      )}
                    </h3>
                  </div>
                </div>
              )}
            </Button>
          </div>
        </div>
        <div
          className={
            "div-divide mx-[8px] mx-auto flex flex-row-reverse items-center border-r border-dashed border-gray-200 pb-[32px] dark:border-gray-700"
          }
        ></div>
        <div>
          <span className="mb-[4px] mr-[4px] text-[12px]">Opponent</span>
          <span className="text-primary mb-[4px] cursor-pointer text-[10px]">
            {shortAddress(opponent.address)}
          </span>
          <div className="grid grid-cols-3 gap-[6px]">
            {!!opponent?.squad.length
              ? opponent.squad.map((item, idx) => (
                  <MiniNft key={idx} nftId={item.toString()} />
                ))
              : [0, 0, 0].map((item, idx) => (
                  <MiniNft key={idx} nftId={item.toString()} />
                ))}
          </div>
        </div>
      </div>
      <div className="mt-[32px] grid grid-cols-2 gap-[32px]">
        <RoundRanking
          round={currentRound}
          refresh={refreshRanking}
          tournamentStarted={tournamentHasStarted()}
        ></RoundRanking>
        <RoundRanking round={0} refresh={refreshRanking}></RoundRanking>
        {/* <div>Tournament ranking </div> */}
      </div>
      <ChooseHeroesDialog
        isOpen={chooseLineUp}
        setIsOpen={setChooseLineUp}
        refetch={refetchData}
      />
    </div>
  )
}
