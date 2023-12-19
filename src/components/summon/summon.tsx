"use client"

import { useLayout } from "@/lib/hooks/use-layout"
import { useEffect, useState } from "react"
import classNames from "classnames"
import Button from "@/components/ui/button"
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { GetChainID, ZERO_ADDRESS } from "@/utils"
import { Poppins } from "next/font/google"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { NFTS_YOUR_NFT_BALANCE } from "@/utils/constants"
import BoxHistory from "@/components/summon/history"
import { History } from "@/models/history"
import {
  BusdTokenAddress,
  BusdTokenContract,
  MultiviewContract,
  PandaBoxAddress,
  PandaBoxContract,
  PandaNFTAddress,
  PandaNFTContract,
} from "@/config/contracts"
import { ethers } from "ethers"
import { Address } from "@/models"
import { DEFAULT_APPROVAL_TOKEN_AMOUNT } from "@/config"
import { decodeEventLog } from "viem"
import { PandaNFTABI } from "@/config/abis"
import PandaTokenABI from "@/config/abis/PandaToken"
import BuyBoxTxDetailDialog from "@/components/summon/buy-box-tx-detail-dialog"
import Token from "@/components/ui/token"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import BoxOpenConfirmDialog from "@/components/summon/open-box-confirm"
import OpenBoxResultDialog from "@/components/summon/open-box-result"
import { SummonBackground } from "@/components/summon/summon-background"
import Treasure from "@/components/ui/treasure-lottie"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const NUMB_PER_PAGE = 50

const MapRarityColor = [
  {
    name: "common",
    value: "bg-[#94a3b8]",
    rate: "50.0%",
  },
  {
    name: "uncommon",
    value: "bg-[#84cc16]",
    rate: "35.0%",
  },
  {
    name: "rare",
    value: "bg-[#6366f1]",
    rate: "12.0%",
  },
  {
    name: "epic",
    value: "bg-[#7e22ce]",
    rate: "2.5%",
  },
  {
    name: "legendary",
    value: "bg-[#b45309]",
    rate: "0.5%",
  },
]

export function BuyBoxAction({
  isLoading,
  setIsLoading,
  buyQuantity,
  boxBalanceQuery,
  referralAddress,
  boxPrice,
}: {
  isLoading: boolean
  setIsLoading: any
  buyQuantity: number
  boxBalanceQuery: any
  referralAddress: Address
  boxPrice: bigint
}) {
  const router = useRouter()

  let [buyBoxDialog, setBuyBoxDialog] = useState(false)
  let [totalAmount, setTotalAmount] = useState<bigint>(0n)
  let [txHash, setTxHash] = useState("")
  const { config } = usePrepareContractWrite({
    ...PandaBoxContract,
    functionName: "buyBox",
    args: [buyQuantity, referralAddress],
    value:
      BusdTokenAddress === ZERO_ADDRESS ? boxPrice * BigInt(buyQuantity) : 0,
  })

  const { write, data, isLoading: buyCfgLoading } = useContractWrite(config)
  let { isLoading: buyLoading, isSuccess: success } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (result) => {
      const logs = result.logs
      // let i = 0
      // if (logs.length > 2) {
      //   i = 1
      // }
      // const refAmountData = decodeEventLog({
      //   abi: PandaBoxABI,
      //   data: logs[7].data,
      //   topics: logs[7].topics,
      // })
      setTotalAmount(boxPrice * BigInt(buyQuantity))
      setTxHash(logs[1].transactionHash)
      setBuyBoxDialog(true)
      boxBalanceQuery.refetch()
    },
  })
  useEffect(() => {
    setIsLoading(buyLoading || buyCfgLoading)
  }, [buyCfgLoading, buyLoading])

  const onBuyBox = () => {
    if (buyQuantity <= 0) {
      toast.error("Buy box quantity has to be larger than 0.")
      return
    }
    write?.()
  }

  return (
    <>
      <Button
        className={"w-40"}
        isLoading={isLoading}
        disabled={!write || isLoading}
        shape={"rounded"}
        size={"medium"}
        onClick={() => onBuyBox()}
      >
        <div className={"flex items-center"}>
          <p className={"mr-2"}>Buy</p>
          <p
            className="focus:ring-none
                       rounded-lg bg-transparent hover:cursor-default"
          >
            {Number(ethers.formatEther(BigInt(buyQuantity) * boxPrice))}{" "}
          </p>
          <Token className={"ml-1 h-4 w-4"} />
        </div>
      </Button>
      <BuyBoxTxDetailDialog
        isOpen={buyBoxDialog}
        setIsOpen={setBuyBoxDialog}
        totalAmount={totalAmount}
        txHash={txHash}
      />
    </>
  )
}

export function ApproveAction({
  isLoading,
  setIsLoading,
  allowanceQuery,
  buyQuantity,
  boxPrice,
}: {
  isLoading: boolean
  setIsLoading: any
  allowanceQuery: any
  buyQuantity: number
  boxPrice: bigint
}) {
  const { config: approveTokenCfg } = usePrepareContractWrite({
    ...BusdTokenContract,
    functionName: "approve",
    args: [PandaBoxAddress, DEFAULT_APPROVAL_TOKEN_AMOUNT],
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
        className={"w-fit"}
        isLoading={isLoading}
        disabled={!writeApproveToken || isLoading}
        shape={"rounded"}
        size={"medium"}
        onClick={() => writeApproveToken?.()}
      >
        <div className={"flex items-center"}>
          <p className={"mr-2"}>Approve</p>
          <p
            className="focus:ring-none
                       rounded-lg bg-transparent hover:cursor-default"
          >
            {Number(ethers.formatEther(BigInt(buyQuantity) * boxPrice))}{" "}
          </p>
          <Token className={"ml-1 h-4 w-4"} />
        </div>
      </Button>
    </>
  )
}

const MaxBoxes = 10

export default function Summon() {
  const { layout } = useLayout()
  const { address } = useAccount()
  let [openBoxResult, setOpenBoxResult] = useState(false)
  let [boxBalance, setBoxBalance] = useState(0)
  let [allowance, setAllowance] = useState(BigInt(0))

  let [isLoading, setIsLoading] = useState(false)
  let [isApproved, setIsApproved] = useState(false)
  let [buyQuantity, setBuyQuantity] = useState(1)
  let [openQuantity, setOpenQuantity] = useState(10)
  let [nftBalance, setNftBalance] = useState(0)

  let [recent, setRecent] = useState<History[]>([])
  let [myRecords, setMyRecords] = useState<History[]>([])
  let [allCount, setAllCount] = useState(0)
  let [myCount, setMyCount] = useState(0)
  let [totalRecentPgs, setTotalRecentPgs] = useState(0)
  let [totalMyRecordPgs, setTotalMyRecordPgs] = useState(0)
  let [recentCurrent, setRecentCurrent] = useState(1)
  let [myRecordCurrent, setMyRecordCurrent] = useState(1)
  let [ids, setIds] = useState<bigint[]>([])
  let [amount, setAmount] = useState<bigint>(BigInt(0))
  let [openSuccess, setOpenSuccess] = useState(false)
  let [nfts, setNfts] = useState([])
  let [boxPrice, setBoxPrice] = useState<bigint>(0n)
  let [boxConfirm, setBoxConfirm] = useState(false)
  let [openTxHash, setOpenTxHash] = useState("")

  const boxPriceQuery = useContractRead({
    ...PandaBoxContract,
    functionName: "BOX_PRICE",
    onSuccess: (result) => {
      console.log("price", result)
      setBoxPrice(result)
    },
  })

  const referral = localStorage.getItem("referralAddress")
    ? localStorage.getItem("referralAddress")
    : ZERO_ADDRESS

  function getNFTsConfig() {
    let configs = []
    ids?.forEach((index) => {
      configs = [
        ...configs,
        {
          ...PandaNFTContract,
          functionName: "attributes",
          chainId: GetChainID(),
          args: [index],
        },
      ]
    })
    return configs
  }

  const nftQuery = useContractReads({
    contracts: getNFTsConfig(),
    onSuccess(result) {
      setNfts(result)
    },
  })

  useEffect(() => {
    setTotalRecentPgs(Math.ceil(allCount / NUMB_PER_PAGE))
    allHistoryQuery.refetch()
  }, [allCount])

  useEffect(() => {
    setTotalMyRecordPgs(Math.ceil(myCount / NUMB_PER_PAGE))
    boxHistoryQuery.refetch()
  }, [myCount])

  useEffect(() => {
    setRecent([])
    allHistoryQuery.refetch()
  }, [recentCurrent])

  useEffect(() => {
    setMyRecords([])
    boxHistoryQuery.refetch()
  }, [myRecordCurrent])

  function getAllHistoryArgs() {
    let offset = 0
    let limit = NUMB_PER_PAGE
    if (allCount - recentCurrent * NUMB_PER_PAGE >= 0) {
      offset = allCount - recentCurrent * NUMB_PER_PAGE
    } else {
      offset = 0
      limit = allCount - (totalRecentPgs - 1) * NUMB_PER_PAGE
    }
    return [PandaBoxAddress, PandaNFTAddress, ZERO_ADDRESS, offset, limit]
  }

  function getMyRecordsArgs() {
    let offset = 0
    let limit = NUMB_PER_PAGE
    if (myCount - myRecordCurrent * NUMB_PER_PAGE >= 0) {
      offset = myCount - myRecordCurrent * NUMB_PER_PAGE
    } else {
      offset = 0
      limit = myCount - (totalMyRecordPgs - 1) * NUMB_PER_PAGE
    }
    return [PandaBoxAddress, PandaNFTAddress, address as Address, offset, limit]
  }

  // Get All Box history count
  const allCountQuery = useContractRead({
    ...PandaBoxContract,
    functionName: "openBoxHistoryCounter",
    args: [ZERO_ADDRESS],
    onSuccess: (result) => {
      setAllCount(Number(result))
    },
  })

  // Get User Box history count
  const myCountQuery = useContractRead({
    ...PandaBoxContract,
    functionName: "openBoxHistoryCounter",
    args: [address as Address],
    onSuccess: (result) => {
      setMyCount(Number(result))
    },
  })

  const boxHistoryQuery = useContractRead({
    ...MultiviewContract,
    functionName: "openBoxHistory",
    args: getMyRecordsArgs(),
    onSuccess: (result) => {
      let history: History[] = []

      result.forEach((item, idx) => {
        if (item.owner !== ZERO_ADDRESS) {
          history = [
            ...history,
            {
              ...item,
              amount: item.nfts.length,
              reward: ethers.formatEther(item.tokenAmount).replace(/\.0$/, ""),
            },
          ]
        }
      })
      setMyRecords(history)
    },
  })
  const allHistoryQuery = useContractRead({
    ...MultiviewContract,
    functionName: "openBoxHistory",
    args: getAllHistoryArgs(),
    onSuccess: (result) => {
      let history: History[] = []
      result.forEach((item, idx) => {
        if (item.owner !== ZERO_ADDRESS) {
          history = [
            ...history,
            {
              ...item,
              amount: item.nfts.length,
              reward: ethers.formatEther(item.tokenAmount).replace(/\.0$/, ""),
            },
          ]
        }
      })
      setRecent(history)
    },
  })

  const nftBalanceQuery = useContractRead({
    ...PandaNFTContract,
    functionName: "balanceOf",
    args: [address],
    scopeKey: NFTS_YOUR_NFT_BALANCE,
    onSuccess(result) {
      setNftBalance(result)
    },
  })

  // const boxPrice = 3000000000000000000n
  // @ts-ignore
  let boxBalanceQuery = useContractRead({
    ...PandaBoxContract,
    functionName: "balanceOf",
    args: [address, 0],
    onSuccess: (result) => {
      setBoxBalance(result)
    },
  })

  // @ts-ignore
  const allowanceQuery = useContractRead({
    ...BusdTokenContract,
    functionName: "allowance",
    args: [address, PandaBoxAddress],
    onSuccess: (result) => {
      setAllowance(result)
    },
  })

  const {
    write,
    isLoading: openLoading,
    data: openData,
  } = useContractWrite({
    ...PandaBoxContract,
    functionName: "openBox",
    args: [openQuantity],
    onSuccess: () => {
      setNfts([])
      setIds([])
      setAmount(BigInt(0))
      setOpenSuccess(false)
      setOpenBoxResult(true)
    },
  })

  const { isLoading: handleTxLoading, data: dataOpen } = useWaitForTransaction({
    hash: openData?.hash,
    onSuccess: (result) => {
      const logs = result.logs

      const eventData = decodeEventLog({
        abi: PandaTokenABI,
        data: logs[0].data,
        topics: logs[0].topics,
      })
      setAmount(eventData.args.value)

      let ids = []
      for (let i = 1; i <= openQuantity; i++) {
        try {
          const eventData = decodeEventLog({
            abi: PandaNFTABI,
            data: logs[i].data,
            topics: logs[i].topics,
          })
          ids = [...ids, eventData.args.tokenId]
        } catch (e) {}
      }
      setIds(ids)
      setOpenTxHash(logs[0].transactionHash)

      boxBalanceQuery.refetch()
      nftBalanceQuery.refetch()
      myCountQuery.refetch()
      nftQuery.refetch()
      setOpenSuccess(true)
    },
  })

  useContractEvent({
    ...PandaBoxContract,
    eventName: "BoxOpened",
    listener(log) {
      allCountQuery.refetch()
      myCountQuery.refetch()
    },
  })

  useEffect(() => {
    setIsApproved(allowance > boxPrice)
  }, [allowance])

  function onChangeBuyQuantity(event: any) {
    const val = event.target.value
    if (val === "" || val.match(/^[0-9]*$/)) {
      setBuyQuantity(event.target.value)
    }
  }

  function onChangeOpenQuantity(event: any) {
    setOpenQuantity(event.target.value)
  }

  function onOpenBox() {
    setNfts([])
    setIds([])
    setAmount(BigInt(0))
    setOpenSuccess(false)
    if (openQuantity <= 0) {
      toast.error("Please fill open boxes quantity.")
      return
    }
    if (openQuantity > MaxBoxes) {
      toast.error("Maximum box open limit: 10 boxes.")
      return
    }
    if (openQuantity > boxBalance) {
      toast.error("Insufficient Boxes to Open")
      return
    }
    write?.()
  }

  // TODO: display empty balance
  if (!boxBalance) boxBalance = 0

  const onSetMaxOpen = () => {
    if (boxBalance >= 10) {
      setOpenQuantity(10)
    } else {
      setOpenQuantity(Number(boxBalance))
    }
  }

  return (
    <div className={"grid grid-cols-12 gap-5"}>
      <div
        className={
          "relative col-span-7 flex flex-col items-center rounded-xl bg-white p-8 dark:bg-light-dark"
        }
      >
        <div className={"mx-auto flex w-fit -translate-y-10 flex-col gap-y-5"}>
          <Treasure />
        </div>
        <div
          className={
            "mx-auto flex w-40 items-center justify-between gap-x-5 gap-y-0"
          }
        >
          <div
            className={classNames(
              "w-6",
              buyQuantity <= 0
                ? "cursor-not-allowed text-gray-500"
                : "cursor-pointer hover:scale-125 hover:text-blue-500",
            )}
            onClick={() => {
              if (buyQuantity > 0) {
                setBuyQuantity((prev) => Number(prev) - 1)
              }
            }}
          >
            <FontAwesomeIcon icon={faMinus} className={"h-6 w-6"} />
          </div>
          <input
            type="text"
            onChange={onChangeBuyQuantity}
            value={buyQuantity}
            placeholder={""}
            inputMode="numeric"
            className={classNames(
              "w-20 rounded border-0 p-2 text-center text-2xl outline-none ring-2 ring-blue-800/70 disabled:opacity-75" +
                " select-all text-white dark:bg-light-dark",
            )}
          />
          <div
            className="w-6 cursor-pointer hover:scale-125"
            onClick={() => setBuyQuantity((prev) => Number(prev) + 1)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className={"h-6 w-6 hover:text-blue-500"}
            />
          </div>
        </div>
        <div className={"mx-auto mb-20 mt-5 w-fit text-center"}>
          {((isApproved || BusdTokenAddress === ZERO_ADDRESS) && (
            <BuyBoxAction
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              buyQuantity={buyQuantity}
              boxBalanceQuery={boxBalanceQuery}
              referralAddress={referral}
              boxPrice={boxPrice}
            />
          )) || (
            <ApproveAction
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              allowanceQuery={allowanceQuery}
              buyQuantity={buyQuantity}
              boxPrice={boxPrice}
            />
          )}
        </div>
        <div
          className={
            "absolute bottom-0 grid h-16 w-full grid-cols-5 rounded-b-xl bg-[#172554]/40"
          }
        >
          {MapRarityColor.map((item, idx) => {
            return (
              <div
                key={idx}
                className={"flex items-center gap-2 place-self-center"}
              >
                <span
                  className={classNames(
                    "h-5 w-5 rounded-full border-4 border-double border-gray-600 shadow",
                    item.value,
                  )}
                ></span>
                <div className={"text-xs uppercase antialiased"}>
                  <p>{item.name}</p>
                  <p className={classNames(poppin_font.className)}>
                    {item.rate}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div
        className={"relative col-span-5 rounded-xl bg-white dark:bg-light-dark"}
      >
        <Button
          className={
            "absolute left-1/2 top-[350px] mx-auto w-fit -translate-x-1/2"
          }
          shape={"rounded"}
          size={"medium"}
          onClick={() => {
            setBoxConfirm(true)
          }}
        >
          SUMMON
        </Button>
        <div className={"h-[450px] w-full"}>
          <SummonBackground />
        </div>
        <OpenBoxResultDialog
          isOpen={openBoxResult}
          setIsOpen={setOpenBoxResult}
          openSuccess={openSuccess}
          nftIds={ids}
          nfts={nfts}
          setOpenSuccess={setOpenSuccess}
          amount={amount}
          txHash={openTxHash}
        />
      </div>
      <BoxOpenConfirmDialog
        isOpen={boxConfirm}
        setIsOpen={setBoxConfirm}
        boxBalance={boxBalance}
        write={write}
        openQuantity={openQuantity}
        setOpenQuantity={setOpenQuantity}
        loading={handleTxLoading || openLoading}
      />
      <div className={"col-span-12 py-5"}>
        <BoxHistory
          recent={recent}
          myRecords={myRecords}
          recentTotal={totalRecentPgs}
          recentCurrent={recentCurrent}
          setRecentCurrent={setRecentCurrent}
          myTotal={totalMyRecordPgs}
          myCurrent={myRecordCurrent}
          setMyCurrent={setMyRecordCurrent}
        />
      </div>
    </div>
  )
}
