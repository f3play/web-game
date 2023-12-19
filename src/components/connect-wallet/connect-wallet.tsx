"use client"
import {TomoChain, TomoChainTestnet} from "@/config/chains"
import { BusdTokenAddress, TournamentContract } from "@/config/contracts"
import { publicClient } from "@/config/wagmi"
import { TournamentInfo, tournamentInfoFromData } from "@/models/tournamentInfo"
import {
  formatTimeNumber,
  formatTokenAmountString,
  numberWithCommas,
} from "@/utils/strings"
import { useWeb3Modal } from "@web3modal/react"
import classNames from "classnames"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ZERO_ADDRESS } from "@/utils"
import Token from "@/components/ui/token"

export default function ConnectWalletUI({ className }: { className: any }) {
  const { open } = useWeb3Modal()
  const endTime = 1692896400
  const [hour, setHour] = useState(0)
  const [min, setMin] = useState(0)
  const [second, setSecond] = useState(0)
  const [tourInfo, setTourInfo] = useState<TournamentInfo>()
  const chainId = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? TomoChain.id : TomoChainTestnet.id
  
  const fetchTournamentInfo = async () => {
    const client = publicClient({ chainId })

    const data = await client.readContract({
      ...TournamentContract,
      functionName: "tournamentInfo",
    })

    const newTourInfo = tournamentInfoFromData(data)
    if (JSON.stringify(newTourInfo) != JSON.stringify(tourInfo)) {
      setTourInfo(newTourInfo)
    }
  }

  //   fetchTournamentInfo()

  const getReturnValues = (endTime: number) => {
    const now = Math.floor(new Date().getTime() / 1000)
    const countDown = tourInfo.endTime - now

    // calculate time left
    const hours = Math.floor(countDown / (60 * 60))
    const minutes = Math.floor((countDown % (60 * 60)) / 60)
    const seconds = Math.floor(countDown % 60)

    return [hours, minutes, seconds]
  }

  useEffect(() => {
    if (!tourInfo) {
      fetchTournamentInfo()
    }
    const interval = setInterval(() => {
      const [countHour, countMin, countSec] = getReturnValues(endTime)

      setHour(countHour)
      setMin(countMin)
      setSecond(countSec)
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <div
      className={classNames(
        "relative h-[calc(100vh_-_96px)] min-h-[790px] w-full min-w-[1000px]",
        "bg-[url('/assets/game/welcome-background.jpg')] bg-cover bg-bottom",
        className,
      )}
    >
      <Image
        className="width-[300px] absolute right-[100px] top-[30px] 3xl:right-[260px]"
        src={"/assets/game/tournament-reward.png"}
        alt={""}
        width={300}
        height={200}
      />
      <Image
        className="width-[90px] absolute right-[205px] top-[90px] 3xl:right-[365px]"
        src={"/assets/game/reward-text.png"}
        alt={""}
        width={90}
        height={200}
      />

      {(BusdTokenAddress === ZERO_ADDRESS && (
        <div className="text-stroke absolute right-[150px] top-[125px] flex w-[200px] items-center justify-center gap-2 text-center font-mono text-[27px] font-bold uppercase text-yellow-400 3xl:right-[310px]">
          {numberWithCommas(
            parseFloat(formatTokenAmountString(tourInfo?.poolReward || 0, 0)),
          )}
          <Token className={"h-7 w-7"} />
        </div>
      )) || (
        <div className="text-stroke absolute right-[150px] top-[125px] flex w-[200px] items-center justify-center gap-2 text-center font-mono text-[27px] font-bold uppercase text-yellow-400 3xl:right-[310px]">
          $
          {numberWithCommas(
            parseFloat(formatTokenAmountString(tourInfo?.poolReward || 0, 0)),
          )}
        </div>
      )}
      <div className="absolute right-[180px] top-[177px] -rotate-6 text-[13px] font-bold uppercase 3xl:right-[340px]">
        Reward in {formatTimeNumber(hour)}:{formatTimeNumber(min)}:
        {formatTimeNumber(second)}
      </div>
      <Image
        className="width-[270px] absolute right-[120px] top-[260px] cursor-pointer hover:scale-105 3xl:right-[280px]"
        onClick={open}
        src={"/assets/game/connect-button.png"}
        alt={""}
        width={260}
        height={55}
      />
      <Image
        className="width-[700px] absolute left-[50px] top-[50px]"
        src={"/assets/game/welcome-text.png"}
        alt={""}
        width={600}
        height={0}
      />
      <Image
        className="absolute bottom-[50px] left-1/2  mx-auto w-full max-w-[1600px] -translate-x-1/2 transform px-[200px]"
        src={"/assets/game/welcome-battle.png"}
        alt={""}
        width={1100}
        height={0}
      />
      <div className="width-[16px] absolute left-[50px] top-[190px] flex font-arial text-[18px]">
        <Image
          src={"/assets/game/bullet.png"}
          alt={""}
          width={24}
          height={0}
          className="mr-[4px] p-2"
        />
        <span>Funny gaming time with familiar Meme</span>
      </div>
      <div className="width-[16px] absolute left-[50px] top-[218px] flex font-arial text-[18px]">
        <Image
          src={"/assets/game/bullet.png"}
          alt={""}
          width={24}
          height={0}
          className="mr-[4px] p-2"
        />
        <span>Fair to play with 100% On-chain mechanism, no power abusing</span>
      </div>
      <div className="width-[16px] absolute left-[50px] top-[246px] flex font-arial text-[18px]">
        <Image
          src={"/assets/game/bullet.png"}
          alt={""}
          width={24}
          height={0}
          className="mr-[4px] p-2"
        />
        <span>Quick to catch up and earn reward regularly</span>
      </div>
    </div>
  )
}
