import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid"

export const NftUpgradeStats = ({
  attribute,
  oldIndex,
  newIndex,
}: {
  attribute: string
  oldIndex: number
  newIndex: number
}) => {
  return (
    <div className="mx-[48px] my-[8px] grid grid-cols-12">
      <div className="col-span-5 font-semibold uppercase">{attribute}</div>
      <p className="col-span-3 text-center text-lg">{oldIndex}</p>
      <div>
        <ChevronDoubleRightIcon
          className="mx-auto mt-[4px]"
          color={"green"}
          width={20}
          height={20}
        />
      </div>
      <p className="col-span-3 text-center text-lg font-bold text-green-500">
        {newIndex == 0 ? "-" : newIndex}
      </p>
    </div>
  )
}
