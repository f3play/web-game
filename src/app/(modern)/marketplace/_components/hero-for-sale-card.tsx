import Image from "next/image"
import { HeroForSale } from "@/models/hero"
import classNames from "classnames"
import { MapBackgroundType, MapBorders } from "@/utils/styles"
import { useRouter } from "next/navigation"
import { Poppins } from "next/font/google"
import { formatTokenAmount } from "@/utils/token"
import {PAYMENT_TOKEN} from "@/config"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function HeroForSaleCard({ hero: hero }: { hero: HeroForSale }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push("marketplace/nfts/" + hero.id)}
      className={classNames(
        "relative overflow-hidden rounded-lg bg-white shadow transition-all duration-200 dark:bg-light-dark",
        "border-4 border-double border-opacity-80 hover:cursor-pointer",
        MapBorders.get(hero.rarity),
      )}
    >
      <div className="relative block w-full">
        <Image src={hero.img} width={406} height={406} alt="" />
      </div>
      <div
        className={
          "absolute left-3 top-3 rounded-full p-1.5 " +
          MapBackgroundType.get(hero.element)
        }
      >
        <Image
          src={"/assets/Icon/" + hero.element + ".svg"}
          alt={"star"}
          height={15}
          width={15}
        />
      </div>
      <div
        className={classNames(
          "flex h-8 w-10 items-center bg-amber-500 text-center text-xs font-semibold text-black" +
            " absolute right-3 top-3 rounded-full p-2",
          MapBackgroundType.get(hero.element),
          poppin_font.className,
        )}
      >
        <h3 className={"text-center"}>{hero.level}</h3>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-lg font-medium tracking-wider text-black dark:text-white">
          <div>
            <h3>{hero.name}</h3>
          </div>
          <div>
            <h3 className="text-green-400">
              {formatTokenAmount(hero.listing!.price)} {PAYMENT_TOKEN}
            </h3>
          </div>
        </div>
        <div
          className={"mt-1.5  items-center justify-between lg:flex lg:flex-row"}
        >
          <div className={"flex items-center"}>
            <Image
              className={"w-1.5/12"}
              src={"/assets/Icon/attack.svg"}
              alt={""}
              width={20}
              height={10}
            />
            <p>{hero.attack}</p>
            <Image
              className={"w-1.5/12 ml-2"}
              src={"/assets/Icon/defense.svg"}
              alt={""}
              width={20}
              height={10}
            />
            <p>{hero.defense}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
