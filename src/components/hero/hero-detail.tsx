"use client"

import Image from "next/image"
import { Suspense } from "react"
import Loader from "@/components/ui/loader"
import ParamTab, { TabPanel } from "@/components/ui/param-tab"
import { MapTextColor } from "@/utils/styles"
import classNames from "classnames"
import { Hero, HeroListing } from "@/models/hero"
import Button from "@/components/ui/button"
import { formatTokenAmount } from "@/utils/token"
import { PAYMENT_TOKEN } from "@/config"
import { useModal } from "@/components/modal-views/context"
import { useAccount } from "wagmi"
import TradeButton from "../sale/trade-button"
import dayjs from "dayjs"

export default function HeroDetail({
  hero,
  listing,
}: {
  hero: Hero
  listing?: HeroListing
}) {
  const { openModal } = useModal()
  const { address } = useAccount()
  const bg = `/assets/Icon/bg-${hero.rarity}.png`

  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow items-start justify-center md:pb-7 md:pt-4 ltr:md:left-0 ltr:md:pl-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pl-[340px] ltr:xl:pr-12 rtl:xl:pl-12  ltr:2xl:pl-96  3xl:w-[calc(100%-632px)] ltr:4xl:pl-0">
          <div
            className={`flex h-fit max-h-full w-full select-none items-start justify-center lg:max-w-[609px]`}
          >
            <Image
              src={`/assets/Icon/bg-${hero.rarity}.png`}
              alt={""}
              width={316}
              height={500}
            />
            <div className="absolute max-h-full self-center overflow-hidden rounded-lg">
              <Image
                src={hero.img}
                alt={"hero-image"}
                width={270}
                height={500}
                priority={true}
                quality={100}
                className="h-full"
              />
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-grow flex-col ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto lg:min-h-[calc(100vh-200px)] lg:w-[460px] ltr:lg:pl-12 xl:w-[592px] ltr:xl:pl-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  {hero.name}
                </h2>
                <div className="mt-1.5 shrink-0 ltr:ml-3 rtl:mr-3 xl:mt-2">
                  {/*<NftDropDown/>*/}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
                <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 lg:px-6 lg:ltr:border-r">
                  <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                    Type
                  </h3>
                  <div className={`rounded-full py-1`}>
                    {hero.element.toUpperCase()}
                  </div>
                </div>
                <div className="shrink-0 items-center lg:px-6">
                  <h3 className="text-heading-style mb-2.5 uppercase text-gray-900 dark:text-white">
                    Rarity
                  </h3>
                  <div
                    className={classNames(
                      "flex items-center uppercase",
                      MapTextColor.get(hero.rarity),
                    )}
                  >
                    <h3>{hero.rarity}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col pb-5 xl:mt-9">
              <Suspense fallback={<Loader variant="blink" />}>
                <ParamTab
                  tabMenu={[
                    {
                      title: "Details",
                      path: "details",
                    },
                  ]}
                >
                  <TabPanel className="focus:outline-none">
                    <div className="space-y-6">
                      <div className={"block"}>
                        <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                          Stats
                        </h3>
                        <div className="flex gap-1">
                          <Image
                            className={"w-1.5/12"}
                            src={"/assets/Icon/attack.svg"}
                            alt={""}
                            width={25}
                            height={10}
                          />
                          <p>{hero.attack}</p>
                          <Image
                            className={"w-1.5/12 ml-5"}
                            src={"/assets/Icon/defense.svg"}
                            alt={""}
                            width={25}
                            height={10}
                          />
                          <p>{hero.defense}</p>
                        </div>
                      </div>
                      {listing && (
                        <>
                          <div className="block">
                            <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                              Price
                            </h3>
                            <p className="inline-block text-green-400">
                              {formatTokenAmount(listing.price)} {PAYMENT_TOKEN}
                            </p>
                          </div>
                          <div className="block">
                            <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                              Owner
                            </h3>
                            <p className="inline-block text-blue-400">
                              {listing.seller}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="block">
                        <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                          Birthday
                        </h3>
                        <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                          {dayjs(hero.bornAt * 1000).format("MMMM DD, YYYY")}
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel className="hidden"></TabPanel>
                </ParamTab>
              </Suspense>
            </div>
          </div>
          {/* <NftFooter className="hidden md:block" price={hero.price} /> */}

          <div className="sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2">
            <div className="-mx-4 border-t-2 border-gray-900 px-4 pb-4 pt-4 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pb-4 lg:pt-6">
              <div className="grid grid-cols-2 gap-3">
                {address && TradeButton({ user: address, hero, listing })}
                <Button
                  shape="rounded"
                  variant="solid"
                  color="gray"
                  className="dark:bg-gray-800"
                  onClick={() => openModal("SHARE_VIEW")}
                >
                  SHARE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
