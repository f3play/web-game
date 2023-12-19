"use client"

import React from "react"
import { Poppins } from "next/font/google"
import classNames from "classnames"
import { Tab } from "@headlessui/react"
import MyRecordsTable from "@/components/summon/my-records-table"
import { useAccount } from "wagmi"
import { History } from "@/models/history"
import RecentTable from "@/components/summon/recent-table"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const tabMenu = [
  {
    title: "Recent",
  },
  {
    title: "My Records",
  },
]

export const MappingRarityToSmallCard = new Map<number, string>([
  [
    1,
    "border-slate-300/50 bg-gradient-radial from-slate-500/10 from-40% to-slate-500/80",
  ],
  [
    2,
    "border-lime-300/50 bg-gradient-radial from-lime-500/10 from-40% to-lime-500/80",
  ],
  [
    3,
    "border-indigo-300/50 bg-gradient-radial from-indigo-500/10 from-40% to-indigo-500/80",
  ],
  [
    4,
    "border-purple-500/50 bg-gradient-radial from-purple-700/10 from-40% to-purple-700/80",
  ],
  [
    5,
    "border-amber-500/50 bg-gradient-radial from-amber-800/10 from-40% to-amber-800/80",
  ],
])

export default function BoxHistory({
  recent,
  myRecords,
  recentTotal,
  recentCurrent,
  setRecentCurrent,
  myTotal,
  myCurrent,
  setMyCurrent,
}: {
  recent: History[]
  myRecords: History[]
  recentTotal: number
  recentCurrent: number
  setRecentCurrent: any
  myTotal: number
  myCurrent: number
  setMyCurrent: any
}) {
  const { address } = useAccount()

  return (
    <>
      <div className="w-full sm:px-0">
        <Tab.Group>
          <Tab.List className=" flex w-3/12 space-x-1 rounded-xl bg-slate-700/40 p-1">
            {tabMenu.map((tab, idx) => {
              return (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white ring-opacity-60 focus:outline-none uppercase",
                      selected
                        ? "bg-slate-600 shadow dark:bg-[#2a52be]"
                        : "bg-white dark:bg-light-dark",
                    )
                  }
                >
                  {tab.title}
                </Tab>
              )
            })}
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
              className={classNames("rounded-xl", "ring-white ring-opacity-60")}
            >
              <RecentTable setCurrentPage={setRecentCurrent} totalPage={recentTotal} currentPage={recentCurrent} data={recent} />
            </Tab.Panel>
            <Tab.Panel
              className={classNames("rounded-xl", "ring-white ring-opacity-60")}
            >
              <RecentTable setCurrentPage={setMyCurrent} totalPage={myTotal} currentPage={myCurrent} data={myRecords} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}
