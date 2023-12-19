import Image from "next/image"
import { motion } from "framer-motion"
import NftGrid from "@/app/shared/nft-grid"
import { useMultiNFTAttribute } from "@/hooks/useNFT"
import { Address, useContractRead, useWaitForTransaction } from "wagmi"
import Button from "@/components/ui/button"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import classNames from "classnames"
import { randomIntFromInterval, sleep } from "@/utils/number"
import { ethers } from "ethers"
import { TournamentAddress, TournamentContract } from "@/config/contracts"

export default function GameBattle({
  address,
  className,
  round,
  opponent,
  txHash,
}: {
  address: Address
  className?: string
  round: string
  opponent: Address
  txHash: string
}) {
  const router = useRouter()
  const { data: playerInfo } = useGamePlayerInfo(address, round)
  const { data: opponentInfo } = useGamePlayerInfo(opponent, round)

  const [isMoving, setIsMoving] = useState(false)
  const [fight, setFight] = useState(false)
  const [counter, setCounter] = useState(0)

  const [target1, setTarget1] = useState("")
  const [target2, setTarget2] = useState("")

  const [isWin, setIsWin] = useState(false)
  const [finalResult, setFinalResult] = useState(false)

  const nftInfos = useMultiNFTAttribute(
    playerInfo?.squad.filter((i) => !!i) || [],
  )
  const opponentNftInfos = useMultiNFTAttribute(
    opponentInfo?.squad.filter((i) => !!i) || [],
  )

  const {
    data: result,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: txHash,
  })

  useEffect(() => {
    if (!result) {
      return
    }

    async function checkResult(result: any) {
      const log = result.logs.filter(
        (i: any) =>
          i.address.toLocaleLowerCase() ==
          TournamentAddress.toLocaleLowerCase(),
      )[0]
      const iface = new ethers.Interface(TournamentContract.abi)
      const decodedData = await iface.parseLog({
        data: log.data,
        topics: log.topics,
      })

      const isWin = decodedData.args[2]
      console.log("isWin", isWin, decodedData)
      setIsWin(isWin)
      setFinalResult(true)
    }

    checkResult(result)
  }, [result])

  console.log("hashData", result)

  const getMyNftPosition = (idx, total) => {
    // 100vh - 146px
    // 136px - 272px
    return `calc((100vh - 136px - 272px * ${total})/2 + 136px + ${idx * 272}px)`
  }

  useEffect(() => {
    if (counter >= 5) {
      return
    }
    const interval = setInterval(() => {
      heroFight()
    }, 700)

    return () => clearInterval(interval)
  }, [counter])

  const heroFight = () => {
    let u = randomIntFromInterval(0, nftInfos.length - 1)
    let opponent = randomIntFromInterval(0, opponentNftInfos.length - 1)

    setTarget1(getMyNftPosition(u, nftInfos.length))
    setTarget2(getMyNftPosition(opponent, opponentNftInfos.length))
    setFight(true)
    setIsMoving(!isMoving)
    setTimeout(function () {
      setFight(false)
      setCounter(counter + 1)
    }, 700)
  }

  const backToPreviousPage = () => {
    router.replace("/tournament")
  }

  const showResult = () => {
    return result && finalResult && counter >= 5
  }

  useEffect(() => {
    if (showResult()) {
      const interval = setInterval(() => {
        backToPreviousPage()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [finalResult, counter])

  return (
    <>
      <div
        className={classNames(
          "relative h-[calc(100vh_-_136px)] bg-[url('/assets/game/battle-background.jpeg')] bg-cover",
          showResult() ? " opacity-20" : "",
        )}
      >
        <div className="absolute left-[286px] top-1/2 my-auto w-[175px] -translate-x-1/2 -translate-y-1/2 transform transform">
          {[0, 1, 2].map((x, idx) => {
            const hero = nftInfos[idx]
            return (
              <>
                <div id={"squad-" + idx}>
                  {hero && (
                    <NftGrid
                      nft={hero}
                      className={
                        "mx-auto my-[32px] h-[240px] hover:cursor-pointer"
                      }
                      nftId={hero.id}
                    ></NftGrid>
                  )}
                </div>
              </>
            )
          })}
        </div>
        <div className={"absolute bottom-[16px] right-[32px]"}>
          <Button
            shape={"rounded"}
            onClick={() => {
              // randomFight()
              backToPreviousPage()
            }}
            size="small"
            isLoading={false}
          >
            Skip
          </Button>
        </div>
        <div className="absolute right-[286px] top-1/2 my-auto w-[175px] -translate-y-1/2 translate-x-1/2 transform">
          {[0, 1, 2].map((x, idx) => {
            const hero = opponentNftInfos[idx]
            return (
              <>
                <div id={"op-squad-" + idx}>
                  {hero && (
                    <NftGrid
                      nft={hero}
                      className={
                        "mx-auto my-[32px] h-[240px] hover:cursor-pointer"
                      }
                      nftId={hero.id}
                    ></NftGrid>
                  )}
                </div>
              </>
            )
          })}
        </div>
        <motion.div
          className={classNames(
            "absolute h-[100px] w-[100px] -translate-y-1/2  transform ",
            fight ? "visible" : "invisible",
          )}
          animate={{
            top: isMoving ? target1 : target2,
            left: isMoving ? "320px" : "calc(100vw - 800px)",
          }}
          transition={{ duration: 0.7, type: "tween" }}
        >
          <Image
            src={"/assets/game/bomb.png"}
            alt={""}
            width={100}
            height={100}
          ></Image>
        </motion.div>
      </div>
      {showResult() && (
        <>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <motion.div
              className="box"
              animate={{
                scale: [0.5, 1.2, 1],
                rotate: [0, 0, 0],
              }}
              transition={{
                duration: 1.3,
                ease: "easeInOut",
                times: [0, 0.4, 0.7],
              }}
            >
              <Image
                src={
                  isWin ? "/assets/game/victory.svg" : "/assets/game/defeat.svg"
                }
                alt={""}
                width={350}
                height={350}
              ></Image>
            </motion.div>
          </div>
        </>
      )}
    </>
  )
}
