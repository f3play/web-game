import Image from "next/image"
import { NFT } from "@/models/nft"
import classNames from "classnames"
import { MapBackgroundType, MapBorders } from "@/utils/styles"
import { useRouter } from "next/navigation"
import { Poppins } from "next/font/google"
import { useContractRead } from "wagmi"
import { mapNFTAttributeOnchainData, useNFTAttribute } from "@/hooks/useNFT"
import { useEffect, useState } from "react"
import { PandaNFTContract } from "@/config/contracts"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function NftGrid({
  nft,
  className = null,
  detailNavigate = false,
  id,
}: {
  nft: NFT
  className: string
  detailNavigate: boolean
  id: string
}) {
  const router = useRouter()

  const [nftInfo, setNftInfo] = useState({
    id: 2,
    name: "Pandaslayer",
    img: "/assets/characters-demo/warrior-10.png",
    attack: 100,
    defend: 100,
    hp: 100,
    type: "fire",
    rarity: "uncommon",
    level: 100,
  })

  const { data } = useContractRead({
    ...PandaNFTContract,
    functionName: "attributes",
    args: [id],
  })

  useEffect(() => {
    const dataFetched = mapNFTAttributeOnchainData(id, data)
    setNftInfo(dataFetched)
  }, [data])

  // nft = mapNFTAttributeOnchainData(id, nftInfo)

  // return (<div>check</div>)

  return (
    <div
      onClick={() =>
        detailNavigate ? router.push("my-nfts/" + nftInfo.id) : ""
      }
      className={classNames(
        "relative overflow-hidden rounded-lg bg-white shadow transition-all duration-200 dark:bg-light-dark",
        "border-4 border-double border-opacity-80",
        MapBorders.get(nftInfo.rarity),
        className ? className : "",
        detailNavigate ? "hover:cursor-pointer" : "",
      )}
    >
      <div className="relative block w-full">
        <Image src={nftInfo.img} width={500} height={500} alt="" />
      </div>
      <div
        className={
          "absolute left-3 top-3 rounded-full p-1.5 " +
          MapBackgroundType.get(nftInfo.type)
        }
      >
        <Image
          src={"/assets/Icon/" + nftInfo.type + ".svg"}
          alt={"star"}
          height={15}
          width={15}
        />
      </div>
      <div
        className={classNames(
          "flex items-center text-center text-xs font-semibold text-black 2xl:h-8 2xl:w-10" +
            " absolute right-3 top-3 rounded-full bg-amber-500 p-2",
          poppin_font.className,
        )}
      >
        <h3 className={"mx-auto text-center"}>{nftInfo.id}</h3>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-lg font-medium tracking-wider text-black dark:text-white">
          <h3>{nftInfo.name}</h3>
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
            <p>{nftInfo.attack}</p>
            <Image
              className={"w-1.5/12 ml-2"}
              src={"/assets/Icon/defense.svg"}
              alt={""}
              width={20}
              height={10}
            />
            <p>{nftInfo.defend}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
