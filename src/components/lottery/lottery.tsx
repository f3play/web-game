"use client"
import Image from "next/image"
import classNames from "classnames"
import { Poppins } from "next/font/google"
import Button from "@/components/ui/button"
import React, {Fragment, useEffect, useRef, useState} from "react"
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import {
  LotteryAddress,
  LotteryContract,
  LotteryTokenContract,
} from "@/config/contracts"
import { Address } from "@/models"
import { ethers } from "ethers"
import { DEFAULT_APPROVAL_TOKEN_AMOUNT } from "@/config"
import { Transition } from "@/components/ui/transition"
import { Dialog } from "@/components/ui/dialog"
import LotteryTable from "@/components/lottery/lottery-table"
import { decodeEventLog } from "viem"
import LotteryABI from "@/config/abis/Lottery"
import Lottie from "lottie-react";
import lotteryWheel from "@/assets/images/lottie/lottery.json"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const MIN_ALLOWANCE = BigInt(1000000000000000000)

export function Approve({ allowanceQuery }: { allowanceQuery: any }) {
  let [isLoading, setIsLoading] = useState(false)
  const { config: approveTokenCfg } = usePrepareContractWrite({
    ...LotteryTokenContract,
    functionName: "approve",
    args: [LotteryAddress, DEFAULT_APPROVAL_TOKEN_AMOUNT],
  })

  const {
    write: writeApproveToken,
    data: approveTokenData,
    isLoading: approveCfgLoading,
  } = useContractWrite(approveTokenCfg)
  let { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveTokenData?.hash,
    onSuccess: () => {
      allowanceQuery.refetch()
    },
  })

  useEffect(() => {
    setIsLoading(approveLoading || approveCfgLoading)
  }, [approveLoading, approveCfgLoading])
  return (
    <>
      <Button
        className={"mx-auto w-3/12"}
        isLoading={isLoading}
        disabled={!writeApproveToken || isLoading}
        shape={"rounded"}
        size={"medium"}
        onClick={() => writeApproveToken?.()}
      >
        Approve
      </Button>
    </>
  )
}

export function LotteryDialog({
  isOpen,
  setIsOpen,
  result,
  isSuccess,
}: {
  isOpen: boolean
  setIsOpen: any
  result: bigint
  isSuccess: boolean
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        onClose={() => {
          // setIsOpen(false)
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-80"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-80"
        >
          <div className="fixed inset-0 bg-[#0D1321] bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-1.5 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="grid w-fit min-w-[40%] scale-[0.77] transform grid-cols-1 rounded-2xl
                     bg-gray-700 pb-7 align-middle shadow-xl transition-all"
              >
                <div
                  className={"flex h-[450px] flex-col justify-between gap-5"}
                >
                  <div className={"title bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>Lottery Result</p>
                  </div>
                  {(!isSuccess && (
                    <div className={"mx-auto animate-pulse"}>
                      <div
                        className={
                          "h-36 w-36 animate-pulse place-self-center rounded-full bg-slate-600"
                        }
                      />
                      <div className="col-span-2 mx-auto h-8 w-6/12 animate-pulse rounded-2xl bg-slate-700"></div>
                    </div>
                  )) || (
                    <div>
                      {!result && (
                        <div className={"flex flex-col"}>
                          <Image
                            src={"/assets/Icon/trollface.png"}
                            alt={"treasure"}
                            className={"mx-auto w-36"}
                            width={144}
                            height={144}
                          />
                          <p className={"text-2xl text-amber-400"}>
                            Wish you lucky next time
                          </p>
                        </div>
                      ) || 
                        <div>
                          {result.boxAmount > 0n && (
                              <div className={'flex flex-col'}>
                                <Image
                                  src={"/assets/Icon/treasure.png"}
                                  alt={"treasure"}
                                  className={"mx-auto w-36"}
                                  width={250}
                                  height={450}
                                />
                                <p className={"text-2xl text-amber-400"}>1 BOX</p>
                              </div>
                            ) ||
                            <div className={"flex flex-col"}>
                              <Image
                                src={"/assets/Icon/logo.svg"}
                                alt={"treasure"}
                                className={"mx-auto w-36"}
                                width={250}
                                height={450}
                              />
                              <p className={"text-2xl text-amber-400"}>
                                200 F3
                              </p>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  )}
                  <Button
                    shape={"rounded"}
                    size={"small"}
                    className={"mx-auto w-2/12"}
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default function Lottery() {
  let [lotteryBalance, setLotteryBalance] = useState<bigint>(BigInt(0))
  let [allowance, setAllowance] = useState<bigint>(BigInt(0))
  let [lotteryOpen, setLotteryOpen] = useState(false)
  let [result, setResult] = useState(undefined)
  let [totalReward, setTotalReward] = useState(0)
  let [history, setHistory] = useState([])
  let [openSuccess, setOpenSuccess] = useState(false)
  const wheelRef = useRef()

  const { address } = useAccount()

  const lotteryBalanceQuery = useContractRead({
    ...LotteryTokenContract,
    functionName: "balanceOf",
    args: [address as Address],
    onSuccess: (result) => {
      setLotteryBalance(result)
    },
  })

  const allowanceQuery = useContractRead({
    ...LotteryTokenContract,
    functionName: "allowance",
    args: [address as Address, LotteryAddress],
    onSuccess: (result) => {
      setAllowance(result)
    },
  })

  const rewardTotalQuery = useContractRead({
    ...LotteryContract,
    functionName: "lotteryRewardHistoryCounter",
    onSuccess: (result) => {
      setTotalReward(Number(result))
    },
  })

  function getHistoryCfg() {
    let cfg = []
    for (let i = 0; i < totalReward; i++) {
      cfg = [
        ...cfg,
        {
          ...LotteryContract,
          functionName: "lotteryRewardHistory",
          args: [i],
        },
      ]
    }
    return cfg
  }

  const rewardHistoryQuery = useContractReads({
    contracts: getHistoryCfg(),
    onSuccess: (result) => {
      let data = []
      result.forEach((item) => {
        data = [...data, item.result]
      })
      setHistory(data)
    },
  })

  const {
    write,
    isLoading: openLoading,
    data: openData,
  } = useContractWrite({
    ...LotteryContract,
    functionName: "lucky",
    args: [1],
    gas: 1_000_000n,
    onSuccess: () => {
      
    },
  })

  const {
    isLoading: handleTxLoading,
    data: dataOpen,
  } = useWaitForTransaction({
    hash: openData?.hash,
    onSuccess: (result) => {
      setResult(undefined)
      const logs = result.logs
      if (logs.length > 2) {
        const eventData = decodeEventLog({
          abi: LotteryABI,
          data: logs[2].data,
          topics: logs[2].topics,
        })
        setResult(eventData.args)
      } 
      lotteryBalanceQuery.refetch()
      allowanceQuery.refetch()
      rewardTotalQuery.refetch()
      wheelRef.current.stop()
      setLotteryOpen(true)
        setOpenSuccess(true)
    },
  })

  useEffect(() => {
    rewardHistoryQuery.refetch()
  }, [totalReward])

  function onDrawLucky() {
    setOpenSuccess(false)
    write?.()
    wheelRef.current.play()
  }

  return (
    <div className={"mx-auto grid grid-cols-12 place-content-center gap-5"}>
      <div
        className={
          "relative col-span-12 flex flex-col items-center gap-y-5 rounded-xl"
        }
      >
        <div
          className={
            "mx-auto flex w-7/12 flex-col gap-y-5 bg-white p-5 dark:bg-light-dark"
          }
        >
          <div>
            <Lottie lottieRef={wheelRef} animationData={lotteryWheel} play autoplay={false} className={'w-56 h-56 mx-auto'}/>
            {/*<Image*/}
            {/*  className={"relative mx-auto block select-none rounded-md"}*/}
            {/*  src={"/assets/Icon/lottery.svg"}*/}
            {/*  width={300}*/}
            {/*  height={450}*/}
            {/*  alt=""*/}
            {/*  priority={true}*/}
            {/*/>*/}
          </div>
          <div className={"mx-auto w-fit text-center"}>
            <p
              className={
                "text-base uppercase text-amber-500 subpixel-antialiased"
              }
            >
              Lucky Tickets Remains
            </p>
            <p className={classNames(poppin_font.className, "text-3xl")}>
              {ethers.formatEther(lotteryBalance).replace(/\.0$/, "")}
            </p>
          </div>
          <Button
            shape={"rounded"}
            size={"medium"}
            className={"mx-auto w-3/12"}
            onClick={onDrawLucky}
            disabled={
              handleTxLoading || openLoading || lotteryBalance < MIN_ALLOWANCE
            }
            isLoading={handleTxLoading || openLoading}
          >
            OPEN
          </Button>
        </div>
      </div>
      <div className={"col-span-12 grid gap-y-5 rounded-xl"}>
        <LotteryTable data={history} />
      </div>
      <LotteryDialog
        isOpen={lotteryOpen}
        setIsOpen={setLotteryOpen}
        result={result}
        isSuccess={openSuccess}
      />
    </div>
  )
}
