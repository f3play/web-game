"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Slider from "rc-slider"
import { RadioGroup } from "@/components/ui/radio-group"
import { NormalGridIcon } from "@/components/icons/normal-grid"
import { CompactGridIcon } from "@/components/icons/compact-grid"
import { Listbox } from "@/components/ui/listbox"
import { Transition } from "@headlessui/react"
import { ChevronDown } from "@/components/icons/chevron-down"
import { useGridSwitcher } from "@/lib/hooks/use-grid-switcher"

export function GridSwitcher() {
  const { isGridCompact, setIsGridCompact } = useGridSwitcher()
  return (
    <div className="flex overflow-hidden rounded-lg">
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 ${
          !isGridCompact ? "z-10 text-white" : "text-brand dark:text-white"
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {!isGridCompact && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-full w-full bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <NormalGridIcon className="relative" />
      </button>
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 ${
          isGridCompact ? "z-10 text-white" : "text-brand dark:text-white"
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {isGridCompact && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-full w-full  bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <CompactGridIcon className="relative" />
      </button>
    </div>
  )
}

export const sort = [
  { id: 1, name: "Date Listed: Newest" },
  { id: 2, name: "Date Listed: Oldest" },
  { id: 3, name: "Ending: Soonest" },
  { id: 4, name: "Ending: Latest" },
]

export function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0])
  return (
    <div className="relative">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
          {selectedItem.name}
          <ChevronDown className="ltr:ml-2 rtl:mr-2" />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark sm:w-full">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white sm:text-sm  ${
                      selected
                        ? "my-1 bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

export function PriceRange() {
  let [range, setRange] = useState({ min: 0, max: 1000 })

  function handleRangeChange(value: any) {
    setRange({
      min: value[0],
      max: value[1],
    })
  }

  function handleMaxChange(max: number) {
    setRange({
      ...range,
      max: max || range.min,
    })
  }

  function handleMinChange(min: number) {
    setRange({
      ...range,
      min: min || 0,
    })
  }

  return (
    <div className="p-5">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input
          className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
          type="number"
          value={range.min}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          min="0"
          max={range.max}
        />
        <input
          className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
          type="number"
          value={range.max}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          min={range.min}
        />
      </div>
      <Slider
        range
        min={0}
        max={1000}
        value={[range.min, range.max]}
        allowCross={false}
        onChange={(value) => handleRangeChange(value)}
      />
    </div>
  )
}

export const rarities = [
  {
    name: "-- All --",
    value: 0,
  },
  {
    name: "Common",
    value: 1,
  },
  {
    name: "Uncommon",
    value: 2,
  },
  {
    name: "Rare",
    value: 3,
  },
  {
    name: "Epic",
    value: 4,
  },
  {
    name: "Legendary",
    value: 5,
  },
]

export const elements = [
  {
    name: "-- All --",
    value: 0,
  },
  {
    name: "Maruko",
    value: 1,
  },
  {
    name: "Panda",
    value: 2,
  },
  {
    name: "Boy",
    value: 3,
  },
  {
    name: "Dogee",
    value: 4,
  },
  {
    name: "Quby",
    value: 5,
  },
  {
    name: "Shibafat",
    value: 6,
  },
  {
    name: "Tobee",
    value: 7,
  },
  {
    name: "Moewy",
    value: 8,
  },
  {
    name: "sir",
    value: 9,
  },
]

export function Rarity({ rarity, setRarity }) {
  return (
    <div className="relative z-10 w-56">
      <Listbox value={rarity} onChange={setRarity}>
        <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
          {rarity.name}
          <ChevronDown className="ltr:ml-2 rtl:mr-2" />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark sm:w-full">
            {rarities.map((item, idx) => (
              <Listbox.Option key={idx} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white sm:text-sm  ${
                      selected
                        ? "my-1 bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

export function Element({ element, setElement }) {
  return (
    <div className="relative z-10 w-56">
      <Listbox value={element} onChange={setElement}>
        <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
          {element.name}
          <ChevronDown className="ltr:ml-2 rtl:mr-2" />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark sm:w-full">
            {elements.map((item, idx) => (
              <Listbox.Option key={idx} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white sm:text-sm  ${
                      selected
                        ? "my-1 bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

export function Status() {
  let [plan, setPlan] = useState("buy-now")
  return (
    <RadioGroup
      value={plan}
      onChange={setPlan}
      className="grid grid-cols-2 gap-2 p-5"
    >
      <RadioGroup.Option value="buy-now">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? "border-brand bg-brand text-white shadow-button"
                : "border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            }`}
          >
            Buy Now
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="on-auction">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? "border-brand bg-brand text-white shadow-button"
                : "border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            }`}
          >
            On Auction
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="new">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center
             text-sm font-medium uppercase tracking-wide transition-all ${
               checked
                 ? "border-brand bg-brand text-white shadow-button"
                 : "border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white"
             }`}
          >
            New
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="has-offers">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center
             text-sm font-medium uppercase tracking-wide transition-all ${
               checked
                 ? "border-brand bg-brand text-white shadow-button"
                 : "border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white"
             }`}
          >
            Has offers
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  )
}

export function NFTFilters({ rarity, setRarity, element, setElement }) {
  return (
    <>
      <div className={"flex gap-x-5"}>
        <div className={"flex items-center gap-x-3"}>
          <p>Type</p>
          <Element element={element} setElement={setElement} />
        </div>
        <div className={"flex items-center gap-x-3"}>
          <p>Rarity</p>
          <Rarity rarity={rarity} setRarity={setRarity} />
        </div>
      </div>
    </>
  )
}
