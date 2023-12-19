import Listbox, { ListboxOption } from "@/components/ui/list-box"
import { Switch } from "@/components/ui/switch"
import {
  HeroElement,
  HeroElements,
  HeroRarities,
  HeroRarity,
} from "@/models/hero"
import classNames from "classnames"
import { SetStateAction } from "react"
import { Address, useAccount } from "wagmi"

export interface MarketplaceFilters {
  address: Address | undefined
  element: HeroElement | undefined
  rarity: HeroRarity | undefined
}

const elementOptions = [
  { name: "-- ALL --", value: undefined },
  ...HeroElements.map((element) => ({
    name: element.toUpperCase(),
    value: element,
  })),
]

const rarityOptions = [
  { name: "-- ALL --", value: undefined },
  ...HeroRarities.map((rarity) => ({
    name: rarity.toUpperCase(),
    value: rarity,
  })),
]

export default function MarketplaceFilter({
  filters,
  onFilter,
  className,
}: {
  filters: MarketplaceFilters
  onFilter: (filters: MarketplaceFilters) => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const { address } = useAccount()

  const { element, rarity } = filters
  const selectedElement =
    elementOptions.find((option) => option.value === element) ||
    elementOptions[0]
  const selectedRarity =
    rarityOptions.find((option) => option.value === rarity) || rarityOptions[0]

  const onElementChange = function (
    value: SetStateAction<ListboxOption>,
  ): void {
    filters = {
      ...filters,
      element: (value as any).value as HeroElement,
    }
    onFilter(filters)
  }

  const onRarityChange = function (value: SetStateAction<ListboxOption>): void {
    filters = {
      ...filters,
      rarity: (value as any).value as HeroRarity,
    }
    onFilter(filters)
  }

  const onAddressChange = function (value: boolean): void {
    filters = {
      address: value ? address : undefined,
      element: undefined,
      rarity: undefined,
    }
    onFilter(filters)
  }

  const onlyMyHeroes = filters.address !== undefined

  return (
    <div className={classNames("flex justify-between", className)}>
      <Switch
        checked={onlyMyHeroes}
        onChange={onAddressChange}
        className="flex h-12 items-center gap-2 text-gray-400 sm:gap-3"
      >
        <div
          className={classNames(
            onlyMyHeroes
              ? "bg-brand dark:bg-white"
              : "bg-gray-200 dark:bg-gray-500",
            "relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300",
          )}
        >
          <span
            className={classNames(
              onlyMyHeroes
                ? "bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark"
                : "bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark",
              "inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200",
            )}
          />
        </div>
        <span className="inline-flex text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
          Only my heroes
        </span>
      </Switch>
      {!onlyMyHeroes && (
        <div className="flex gap-4">
          <Listbox
            options={elementOptions}
            selectedOption={selectedElement}
            onChange={onElementChange}
            className="w-56"
            disabled={onlyMyHeroes}
            label="TYPE"
            variant="solid"
          />
          <Listbox
            options={rarityOptions}
            selectedOption={selectedRarity}
            onChange={onRarityChange}
            className="w-56"
            disabled={onlyMyHeroes}
            label="RARITY"
            variant="solid"
          />
        </div>
      )}
    </div>
  )
}
