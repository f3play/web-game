import Image from "next/image"
import classNames from "classnames"
import { MapBorders } from "@/utils/styles"

export const NftSquareItem = ({
  nft,
  isChosen,
  ...props
}: {
  nft: any
  isChosen: boolean
}) => {
  function chosenStyle(id: string) {
    if (isChosen) {
      return "opacity-40 grayscale "
    } else {
      return ""
    }
  }

  return (
    <div
      className={classNames(
        "relative w-full rounded",
        "group inline-block border-3 border-double",
        MapBorders.get(nft.rarity),
      )}
      onClick={props.onClick}
    >
      <Image
        className={classNames(
          "w-full rounded hover:cursor-pointer",
          chosenStyle(nft.id),
        )}
        src={nft.img}
        alt={"hero"}
        width={750}
        height={750}
      />
      {isChosen && (
        <Image
          alt={"checked"}
          src={"/assets/Icon/checked.svg"}
          className={
            "absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transform"
          }
          width={50}
          height={50}
        />
      )}
      <div
        className={classNames(
          "grid items-center text-center text-xs font-semibold text-white 2xl:h-5" +
            " absolute right-[2px] top-[2px] rounded-md bg-slate-700 p-1",
        )}
      >
        <h3 className={"mx-auto place-self-center text-center text-[15px]"}>
          <span>#{nft.id.toString()} </span>
        </h3>
      </div>
    </div>
  )
}
