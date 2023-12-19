import classNames from "classnames"
import { MapBorders } from "@/utils/styles"
import Image from "next/image"
import { getHeroImage } from "@/models/hero"

export const MaterialNFT = ({
  rarity,
  neededAmount,
  availableAmount,
  element,
  ...props
}: {
  rarity: string
  neededAmount: number
  availableAmount: number
  element: string
}) => {
  const isEnoungh = availableAmount >= neededAmount

  return (
    <div
      className="mx-[16px] text-center hover:cursor-pointer"
      onClick={props.onClick}
    >
      <div
        className={classNames(
          "relative w-24 rounded",
          "border-3 border-double ",
          MapBorders.get(rarity),
        )}
      >
        <Image
          className={classNames(
            "w-24 rounded",
            isEnoungh ? " " : "opacity-40 grayscale ",
          )}
          src={getHeroImage(element, rarity)}
          alt={"hero"}
          width={800}
          height={800}
        />
        {!isEnoungh ? (
          <Image
            alt={"checked"}
            src={"/assets/Icon/plus-green.svg"}
            className={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            }
            color={"green"}
            width={20}
            height={20}
          />
        ) : (
          <></>
        )}
      </div>
      <div
        className={classNames(
          "text-md mt-[4px] font-bold ",
          isEnoungh ? "" : "text-red-500",
        )}
      >
        {availableAmount}/{neededAmount}
      </div>
    </div>
  )
}
