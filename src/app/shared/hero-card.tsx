import Image from "next/image"
import classNames from "classnames"
import { MapRarityToGradient, NewMapBorders } from "@/utils/styles"
import { useRouter } from "next/navigation"
import { Poppins } from "next/font/google"
import { AttributeMapping } from "@/utils"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const MappingType = new Map<bigint, string>([
  [0n, "Maruko"],
  [1n, "Panda"],
  [2n, "Maruko"],
  [3n, "Panda"],
  [4n, "Panda"],
])

const MappingRarity = new Map<bigint, string>([
  [0n, "common"],
  [1n, "uncommon"],
  [2n, "rare"],
  [3n, "epic"],
  [4n, "legendary"],
])

export default function HeroCard({
  nft,
  className = null,
  detailNavigate = false,
  nftId,
}: {
  nft: any
  className: string
  detailNavigate: boolean
  nftId: any
}) {
  const router = useRouter()

  if (nft) {
    return (
      <div
        onClick={() => (detailNavigate ? router.push("my-nfts/" + nftId) : "")}
        className={classNames(
          "relative overflow-hidden rounded-lg bg-white shadow transition-all duration-200 dark:bg-light-dark ",
          "h-fit border-4 border-double border-opacity-80",
          NewMapBorders[parseInt(nft[AttributeMapping["rarity"]].toString())],
          className ? className : "",
          "hover:cursor-pointer",
        )}
      >
        <div
          className={classNames(
            "relative mx-auto block",
            MapRarityToGradient[parseInt(nft[1].toString())],
          )}
        >
          <Image
            src={
              "/assets/characters/" +
              MappingType.get(nft[0]) +
              "-" +
              MappingRarity.get(nft[1]) +
              ".png"
            }
            width={300}
            height={450}
            alt=""
          />
        </div>
        <div
          className={classNames(
            "grid items-center text-center text-xs font-semibold text-white 2xl:h-5" +
              " absolute left-3 top-3 rounded-md bg-slate-700 p-1",
            poppin_font.className,
          )}
        >
          <h3 className={"mx-auto place-self-center text-center text-[15px]"}>
            <span class={""}>Lv </span>
            {nft[AttributeMapping["level"]].toString()}
          </h3>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between text-lg font-medium tracking-wider text-black dark:text-white">
            <h3>#{nftId.toString()}</h3>
          </div>
          <div
            className={
              "mt-1.5 hidden items-center justify-between lg:flex lg:flex-row"
            }
          >
            <div className={"flex items-center"}>
              <Image
                className={"w-1.5/12"}
                src={"/assets/Icon/attack.svg"}
                alt={""}
                width={20}
                height={10}
              />
              <p>{nft[AttributeMapping["attack"]].toString()}</p>
              <Image
                className={"w-1.5/12 ml-2"}
                src={"/assets/Icon/defense.svg"}
                alt={""}
                width={20}
                height={10}
              />
              <p>{nft[AttributeMapping["defense"]].toString()}</p>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
