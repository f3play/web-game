"use client"

import cn from "classnames"
import { useWindowScroll } from "@/lib/hooks/use-window-scroll"
import { FlashIcon } from "@/components/icons/flash"
import ActiveLink from "@/components/ui/links/active-link"
import { useIsMounted } from "@/lib/hooks/use-is-mounted"
import WalletConnect from "@/components/nft/wallet-connect"
import routes from "@/config/routes"
import { useLayout } from "@/lib/hooks/use-layout"
import { LAYOUT_OPTIONS } from "@/lib/constants"
import {useAccount, useBalance, useContractEvent, useContractRead} from "wagmi"
import {
  BusdTokenAddress,
  BusdTokenContract,
  LotteryTokenContract,
  MultiviewContract,
  PandaBoxAddress,
  PandaBoxContract,
  PandaNFTAddress,
  PandaTokenContract,
} from "@/config/contracts"
import { ethers } from "ethers"
import { Address } from "@/models"
import Image from "next/image"
import { formatDecimalString, startAndEnd, ZERO_ADDRESS } from "@/utils"
import { useState } from "react"
import { faTicket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Token from "@/components/ui/token";

function NotificationButton() {
  const { layout } = useLayout()
  return (
    <ActiveLink
      href={
        (layout === LAYOUT_OPTIONS.MODERN ? "" : routes.home + layout) +
        routes.notification
      }
    >
      <div
        className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border
       border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large
        focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700
         dark:bg-light-dark dark:text-white sm:h-12 sm:w-12"
      >
        <FlashIcon className="h-auto w-3 sm:w-auto" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-slate-50 sm:h-3 sm:w-3" />
      </div>
    </ActiveLink>
  )
}

function HeaderRightArea() {
  const { address } = useAccount()
  let [busdBalance, setBusdBalance] = useState(0n)
  const { data } = useBalance({
    address,
    watch: true
  })
  const balance = data?.formatted
  const busdQuery = useContractRead({
    ...BusdTokenContract,
    functionName: "balanceOf",
    args: [address as Address],
    watch: true,
    enabled: false,
    onSuccess: (result) => {
      setBusdBalance(result)
    },
  })

  if (BusdTokenAddress !== ZERO_ADDRESS) {
    busdQuery.refetch()
  }

  const { data: f3TokenBalance } = useContractRead({
    ...PandaTokenContract,
    functionName: "balanceOf",
    args: [address as Address],
    watch: true,
  })

  const { data: lotteryBalance } = useContractRead({
    ...LotteryTokenContract,
    functionName: "balanceOf",
    args: [address as Address],
    watch: true,
  })

  let { data: boxBalance } = useContractRead({
    ...PandaBoxContract,
    functionName: "balanceOf",
    args: [address, 0],
    watch: true,
  })
  return (
    <div className="relative order-last flex shrink-0 items-center gap-2 sm:gap-6">
      {/*<NotificationButton />*/}
      {BusdTokenAddress !== ZERO_ADDRESS && (
        <div className={"flex items-center gap-2 text-sm subpixel-antialiased"}>
          <p className={"text-blue-200 align-middle"}>
            {formatDecimalString(
              ethers.formatEther(busdBalance ? busdBalance : 0),
            )}
          </p>
          <Token className={'w-4 h-4'}/>
        </div>
      ) ||
        <div className={"flex items-center gap-1 text-sm subpixel-antialiased"}>
          <p className={"text-blue-200"}>
            {formatDecimalString(balance ? balance : "0")}
          </p>
          <Token className={'w-4 h-4'}/>
        </div>
      }
      <div className={"flex items-center text-sm subpixel-antialiased"}>
        <p className={"text-sky-300"}>
          {parseInt(ethers.formatEther(f3TokenBalance ? f3TokenBalance : 0))}
        </p>
        <Image
          src={"/assets/Icon/logo.svg"}
          alt={"f3-token"}
          width={25}
          height={25}
        />
      </div>
      <div className={"flex items-center gap-2 text-sm subpixel-antialiased"}>
        <p className={"text-amber-500"}>{boxBalance ? boxBalance.toString() : 0}</p>
        <Image
          src={"/assets/Icon/treasure-icon.png"}
          alt={"f3-token"}
          width={20}
          height={20}
        />
      </div>
      <div className={"flex items-center gap-2 text-sm subpixel-antialiased"}>
        <p className={"text-amber-400"}>
          {parseInt(ethers.formatEther(lotteryBalance ? lotteryBalance : 0))}
        </p>
        <FontAwesomeIcon icon={faTicket} className={"h-5 w-5 text-amber-400"} />
      </div>
      <WalletConnect />
    </div>
  )
}

export default function Header({ className }: { className?: string }) {
  const isMounted = useIsMounted()
  const windowScroll = useWindowScroll()
  let [notifications, setNotifications] = useState([])
  let [allCount, setAllCount] = useState(0)

  const allCountQuery = useContractRead({
    ...PandaBoxContract,
    functionName: "openBoxHistoryCounter",
    args: [ZERO_ADDRESS],
    onSuccess: (result) => {
      setAllCount(Number(result))
    },
  })

  function getAllHistoryArgs() {
    let offset = 0
    let limit = 20
    if (allCount - limit >= 0) {
      offset = allCount - limit
    } else {
      offset = 0
    }
    return [PandaBoxAddress, PandaNFTAddress, ZERO_ADDRESS, offset, limit]
  }

  const allHistoryQuery = useContractRead({
    ...MultiviewContract,
    functionName: "openBoxHistory",
    args: getAllHistoryArgs(),
    onSuccess: (result) => {
      let notiData = []
      const sorted = result.sort(
        (a, b) => Number(b.openedAt) - Number(a.openedAt),
      )
      sorted.forEach((history, idx) => {
        const legendCount = history.nfts.filter(
          (item) => item?.attribute.rarity == 5,
        ).length

        const epicCount = history.nfts.filter(
          (item) => item?.attribute.rarity == 4,
        ).length
        if (legendCount > 0 || epicCount > 0) {
          const noti = {
            legend: legendCount,
            epic: epicCount,
            owner: history.owner,
          }

          notiData = [...notiData, noti]
        }
      })
      setNotifications(notiData)
    },
  })

  useContractEvent({
    ...PandaBoxContract,
    eventName: "BoxOpened",
    listener(log) {
      allCountQuery.refetch()
      allHistoryQuery.refetch()
    },
  })

  // useEffect(() => {
  //   nftQuery.refetch()
  // }, [events])

  return (
    <nav
      className={cn(
        "sticky top-0 z-30 h-16 w-full transition-all duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-20 hidden xl:block",
        ((isMounted && windowScroll.y) as number) > 2
          ? "bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80"
          : "",
        className,
      )}
    >
      <div className="flex h-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 3xl:px-10">
        <HeaderRightArea />
        <div className={"w-9/12 select-none overflow-hidden"}>
          <div className={"marquee flex items-center gap-4"}>
            {notifications.map((noti, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    "flex w-fit items-center gap-2 whitespace-nowrap rounded px-3 py-1.5 font-mono text-sm subpixel-antialiased shadow-xl dark:bg-light-dark"
                  }
                >
                  <p className={""}>
                    <span className={"text-sky-500"}>
                      {startAndEnd(noti.owner)}
                    </span>{" "}
                    has opened
                  </p>
                  {noti.legend > 0 && (
                    <p className={"align-middle text-amber-600"}>
                      {noti.legend}&nbsp;legendary
                    </p>
                  )}
                  {noti.epic > 0 && (
                    <p className={"text-pink-700"}>{noti.epic} epic</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
