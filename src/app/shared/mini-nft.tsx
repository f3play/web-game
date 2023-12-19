import { useNFTAttribute } from "@/hooks/useNFT"
import classNames from "classnames"
import Image from "next/image"

export default function MiniNft({
  nftId,
  className,
}: {
  nftId: string
  className: any
}) {
  const { nft: nftInfo, isLoading } = useNFTAttribute(nftId)

  const MappingRarityToSmallCard = new Map<string, string>([
    [
      "common",
      "border-slate-300/50 bg-gradient-radial from-slate-500/10 from-40% to-slate-500/80",
    ],
    [
      "uncommon",
      "border-lime-300/50 bg-gradient-radial from-lime-500/10 from-40% to-lime-500/80",
    ],
    [
      "rare",
      "border-indigo-300/50 bg-gradient-radial from-indigo-500/10 from-40% to-indigo-500/80",
    ],
    [
      "epic",
      "border-purple-500/50 bg-gradient-radial from-purple-700/10 from-40% to-purple-700/80",
    ],
    [
      "legendary",
      "border-amber-500/50 bg-gradient-radial from-amber-800/10 from-40% to-amber-800/80",
    ],
  ])

  return !isLoading && nftId != 0 && nftInfo ? (
    <div
      className={classNames(
        "grid rounded border-2 py-2",
        MappingRarityToSmallCard.get(nftInfo?.rarity),
        className,
      )}
    >
      <Image
        className={"place-self-center"}
        src={nftInfo?.img}
        alt={""}
        width={30}
        height={30}
      />
    </div>
  ) : (
    <div
      className={classNames(
        "grid h-[50px] rounded border-2 py-2",
        MappingRarityToSmallCard.get("common"),
        className,
      )}
    ></div>
  )
}
