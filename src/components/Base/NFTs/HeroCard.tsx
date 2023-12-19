import Image from "next/image"
import { Button } from "@/components/Base/Button"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export const MapBorders = new Map<string, string>([
  ["common", "shadow-slate-400 border-slate-400"],
  ["uncommon", "shadow-lime-500 border-lime-500"],
  ["unique", "shadow-indigo-500 border-indigo-500"],
  ["rare", "shadow-purple-500 border-purple-500"],
  ["epic", "shadow-amber-700 border-amber-700"],
])

export const MapTextColor = new Map<string, string>([
  ["common", "text-slate-500"],
  ["uncommon", "text-lime-700"],
  ["unique", "text-indigo-700"],
  ["rare", "text-purple-700"],
  ["epic", "text-amber-700"],
])

export const MapBackgroundType = new Map<string, string>([
  ["fire", "bg-[#d97706]"],
  ["water", "bg-[#0284c7]"],
  ["grass", "bg-[#84cc16]"],
  ["light", "bg-slate-700"],
  ["shadow", "bg-[#6d28d9]"],
])

// @ts-ignore
export default function HeroCard({ nft, isSell = false }) {
  const router = useRouter()
  return (
    <>
      <div
        className={
          "bg-text-500/20 group relative grid rounded-xl border shadow-lg duration-300 hover:cursor-pointer " +
          MapBorders.get(nft.rarity)
        }
      >
        <div className={"relative mx-auto w-full"}>
          <div
            className={
              "absolute left-3 top-3 rounded-full p-1.5 " +
              MapBackgroundType.get(nft.type)
            }
          >
            <Image
              src={"/assets/Icon/" + nft.type + ".svg"}
              alt={"star"}
              height={12}
              width={12}
            />
          </div>
          <Image
            className={"w-full rounded-t-xl"}
            src={nft.img}
            alt={"nft-images"}
            width={250}
            height={150}
          />
        </div>
        <div className={"p-2"}>
          <div className={"flex items-center justify-between"}>
            <p
              className={
                "text-xl font-semibold " + MapTextColor.get(nft.rarity)
              }
            >
              {nft.name}
            </p>
            <p className={"text-xs"}>lv.{nft.level}</p>
          </div>
          <div className={"flex items-center gap-1"}>
            <Image
              className={"w-1/12"}
              src={"/assets/Icon/attack.svg"}
              alt={""}
              width={25}
              height={10}
            />
            <p className={"text-xs"}>{nft.attack}</p>
            <Image
              className={"ml-2 w-1/12"}
              src={"/assets/Icon/defense.svg"}
              alt={""}
              width={25}
              height={10}
            />
            <p className={"text-xs"}>{nft.defend}</p>
          </div>
        </div>
        {isSell && (
          <div
            className={
              "grid w-full rounded-b-xl duration-200 group-hover:visible group-hover:origin-top"
            }
          >
            <Button
              //@ts-ignore
              onClick={(event) => {
                event.stopPropagation()
                toast("sell")
              }}
              className={
                "rounded-b-xl rounded-t-none border-none font-semibold shadow-none"
              }
            >
              Sell
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
