import NftGrid from "@/app/shared/nft-grid"
import { TournamentContract } from "@/config/contracts"
import { useGamePlayerRank } from "@/hooks/useGameRoundInfo"
import { useMultiNFTAttribute, useNFTAttribute } from "@/hooks/useNFT"
import { shortAddress } from "@/utils/strings"
import classNames from "classnames"
import { Address, useContractRead } from "wagmi"

export default function BattlePlayerInfo({
  address,
  isOpponent = false,
  className,
  round,
}: {
  address: Address
  isOpponent?: boolean
  className?: string
  round: string
}) {
  const { data: playerInfo } = useContractRead({
    ...TournamentContract,
    functionName: "playerInfo",
    args: [address, BigInt(round || "0")],
    enabled: !!address,
  })
  const rankRound = useGamePlayerRank(address, round)

  const nftInfos = useMultiNFTAttribute(
    playerInfo?.squad.filter((i) => !!i) || [],
  )

  const battlePower = () => {
    return nftInfos?.reduce((acc, hero) => {
      return acc + hero.attack + hero.defense
    }, 0)
  }

  return (
    <div className={classNames("w-full px-[32px] py-[32px]", className || "")}>
      <div className="mx-auto text-center text-2xl font-semibold">
        {isOpponent ? "Opponent" : "You"}
      </div>
      <div className="mx-auto mt-[16px] grid h-[200px] grid-cols-3 gap-[12px] 3xl:h-[240px]">
        {[0, 1, 2].map((x, idx) => {
          const hero = nftInfos[idx]
          return (
            <div key={idx}>
              {hero ? (
                <NftGrid
                  nft={hero}
                  className={
                    "mx-auto h-[200px] hover:cursor-pointer 3xl:h-[240px]"
                  }
                  nftId={hero.id}
                ></NftGrid>
              ) : (
                <div className="m-[12px] h-[178px] rounded border-2 border-slate-300/50 bg-gradient-radial from-slate-500/10 from-40% to-slate-500/80 3xl:h-[218px]"></div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-[32px] w-full">
        <div className="mx-auto text-center text-lg font-semibold hover:cursor-pointer">
          {shortAddress(address)}
        </div>
        <div className="mx-[96px] mt-[16px] grid grid-cols-4 gap-y-[8px] text-sm">
          <div className="col-span-3">Battle Power</div>
          <div className="text-center">{battlePower()}</div>

          <div className="col-span-3">Rank</div>
          <div className="text-center">
            {!rankRound || rankRound <= 0 ? "Unranked" : rankRound}
          </div>

          <div className="col-span-3">Score</div>
          <div className="text-center">{playerInfo?.score.toString()}</div>
        </div>
      </div>
    </div>
  )
}
