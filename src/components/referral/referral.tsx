"use client"
import classNames from "classnames"
import { Copy } from "@/components/icons/copy"
import { Check } from "@/components/icons/check"
import { useEffect, useState } from "react"
import { useCopyToClipboard } from "react-use"
import { useAccount, useContractRead, useContractReads } from "wagmi"
import { ReferralContract } from "@/config/contracts"
import { Address } from "@/models"
import { ethers } from "ethers"
import ReferralTable from "@/components/referral/referral-table"
import Image from "next/image"
import Token from "@/components/ui/token";

export default function Referral() {
  const [copyButtonStatus, setCopyButtonStatus] = useState(false)
  const [_, copyToClipboard] = useCopyToClipboard()
  const { address } = useAccount()
  const currentDomain = window.location.host
  const referral = "https://" + currentDomain + "?referral=" + address
  let [refPercent, setRefPercent] = useState(0)
  let [refClaimed, setRefClaimed] = useState(BigInt(0))
  let [refTotal, setRefTotal] = useState(0)
  let [refCounter, setRefCounter] = useState(0)
  let [refHistory, setRefHistory] = useState([])

  function handleCopyToClipboard() {
    copyToClipboard(referral)
    setCopyButtonStatus(true)
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus)
    }, 2500)
  }

  // const percentQuery = useContractRead({
  //   ...ReferralContract,
  //   functionName: "rewardPercentRootOfReferral",
  //   args: [address as Address],
  //   onSuccess: (result) => {
  //     setRefPercent(Number(result))
  //   },
  // })

  const claimedQuery = useContractRead({
    ...ReferralContract,
    functionName: "refBalances",
    args: [address as Address],
    onSuccess: (result) => {
      setRefClaimed(result)
    },
  })

  const totalQuery = useContractRead({
    ...ReferralContract,
    functionName: "referralsInfo",
    args: [address as Address],
    onSuccess: (result) => {
      console.log('result', result)
      setRefTotal(result.referrals.length)
      setRefPercent(Number(result.rewardPercent))
    },
  })

  const historyCounterQuery = useContractRead({
    ...ReferralContract,
    functionName: "refHistoryCounter",
    args: [address as Address],
    onSuccess: (result) => {
      setRefCounter(Number(result))
    },
  })

  function getHistoryCfg() {
    let cfg = []
    for (let i = 0; i < refCounter; i++) {
      cfg = [
        ...cfg,
        {
          ...ReferralContract,
          functionName: "refHistory",
          args: [address, i],
        },
      ]
    }
    return cfg
  }

  const historyQuery = useContractReads({
    contracts: getHistoryCfg(),
    onSuccess: (result) => {
      let data = []
      result.forEach((item) => {
        data = [...data, item.result]
      })
      setRefHistory(data)
    },
  })

  useEffect(() => {
    historyQuery.refetch()
  }, [refCounter])

  return (
    <div className={"flex flex-col gap-5"}>
      <div
        className={classNames(
          "mx-auto flex w-full flex-col bg-white dark:bg-light-dark" +
            " items-center gap-y-5 rounded-xl p-5 shadow-card",
        )}
      >
        <p className={"py-2 text-2xl"}>SHARE YOUR LINK</p>
        <div className={"grid-col-1 grid gap-y-5"}>
          <div className="mb-3 inline-flex h-9 items-center rounded-full bg-white shadow-card dark:bg-slate-600">
            <div className="inline-flex h-full shrink-0 grow-0 items-center rounded-full bg-blue-900 px-4 text-xs text-white sm:text-sm uppercase">
              Your referral
            </div>
            <div className="text truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm">
              {referral}
            </div>
            <div
              className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              title="Copy Address"
              onClick={() => handleCopyToClipboard()}
            >
              {copyButtonStatus ? (
                <Check className="h-auto w-3.5 text-green-500" />
              ) : (
                <Copy className="h-auto w-3.5" />
              )}
            </div>
          </div>
          <div className={"grid grid-cols-3 justify-items-center text-xs text-gray-300 gap-y-3 subpixel-antialiased uppercase"}>
            <p className={'text-slate-400'}>Referral</p>
            <p className={'text-slate-400'}>Reward</p>
            <p className={'text-slate-400'}>Referral Bonus</p>
            <p>{refTotal}</p>
            <div className={"flex items-center gap-2"}>
              <p>{ethers.formatEther(refClaimed)}</p>
              <Token className={'w-4 h-4'}/>
            </div>
            <p>{refPercent}%</p>
          </div>
        </div>
      </div>
      <ReferralTable data={refHistory} />
    </div>
  )
}
