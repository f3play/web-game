"use client"

import { NFT } from "@/models/nft"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import Loader from "@/components/ui/loader"
import ParamTab, { TabPanel } from "@/components/ui/param-tab"
import { useQuery } from "react-query"
import { NFTS_QUERY_KEY } from "@/utils/constants"
import { NFTDetail } from "@/hooks/nfts"
import {
  MapBackgroundType,
  MapRarityName,
  MapTextColor,
  NewMapBackgroundType,
  NewMapTextColor,
  RarityMapping,
} from "@/utils/styles"
import classNames from "classnames"
import Button from "@/components/ui/button"
import { useContractRead } from "wagmi"
import { AttributeMapping } from "@/utils"
import { PandaNFTContract } from "@/config/contracts"

export default function NFT() {
  const router = useRouter()
  // let [nft, setNft] = useState<NFT | null>(null)
  const params = useParams()
  const nftId = params.id
  const { data: nft } = useContractRead({
    ...PandaNFTContract,
    functionName: "attributes",
    args: [nftId],
  })

  if (!nft) {
    return <></>
  }

  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col tracking-wider transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div
          className="relative mb-5 flex flex-grow items-center justify-center md:pb-7 md:pt-4 ltr:md:left-0 ltr:md:pl-6
           rtl:md:right-0 rtl:md:pr-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)]
            ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pl-[340px] ltr:xl:pr-12 rtl:xl:pl-12
             rtl:xl:pr-[340px] ltr:2xl:pl-96 rtl:2xl:pr-96 3xl:w-[calc(100%-632px)] ltr:4xl:pl-0 rtl:4xl:pr-0"
        >
          <div className="flex h-full max-h-full w-full items-center justify-center lg:max-w-[609px]">
            <div className="bg-test relative grid aspect-square max-h-full overflow-hidden rounded-lg">
              <Image
                src={"/assets/characters/character-1.png"}
                alt={"hero-image"}
                width={600}
                height={600}
                priority={true}
                quality={100}
                className="h-10/12 grid w-10/12 place-self-center bg-gray-200 bg-transparent"
              />
            </div>
          </div>
        </div>

        <div
          className="relative flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto
           rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[592px] ltr:xl:pl-20 rtl:xl:pr-20"
        >
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  {"PandaSlayer"}
                </h2>
                <div className="mt-1.5 shrink-0 ltr:ml-3 rtl:mr-3 xl:mt-2">
                  {/*<NftDropDown/>*/}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
                <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 lg:px-6 lg:ltr:border-r lg:rtl:border-l">
                  <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                    Type
                  </h3>
                  <div
                    className={
                      "rounded-full p-2 " +
                      NewMapBackgroundType[
                        parseInt(nft[AttributeMapping["element"]].toString())
                      ]
                    }
                  >
                    <Image
                      src={
                        "/assets/Icon/element-" +
                        nft[AttributeMapping["element"]].toString() +
                        ".svg"
                      }
                      alt={"star"}
                      height={25}
                      width={25}
                    />
                  </div>
                </div>
                <div className="shrink-0 items-center lg:px-6">
                  <h3 className="text-heading-style mb-2.5 uppercase text-gray-900 dark:text-white">
                    Rarity
                  </h3>
                  <div
                    className={classNames(
                      "flex items-center uppercase",
                      NewMapTextColor[
                        parseInt(nft[AttributeMapping["rarity"]].toString())
                      ],
                    )}
                  >
                    <h3>
                      {
                        RarityMapping[
                          parseInt(nft[AttributeMapping["element"]].toString())
                        ]
                      }
                    </h3>
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
                    {
                      title: "Bids",
                      path: "bids",
                    },
                    {
                      title: "History",
                      path: "history",
                    },
                  ]}
                >
                  <TabPanel className="focus:outline-none">
                    <div className="space-y-6">
                      <div className="block">
                        <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                          Description
                        </h3>
                        <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                          The fierce outlaw hero of the wilderness. Armed with a
                          mighty bamboo staff, this panda warrior is a symbol of
                          justice and protection in the dense bamboo thickets.
                          With lightning-fast strikes and unparalleled agility,
                          Pandaslayer defends the natural world against all
                          threats. Embark on an epic adventure and join forces
                          with this legendary hero to restore harmony to the
                          land.
                        </div>
                      </div>
                      <div className={"block"}>
                        <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                          Stats
                        </h3>
                        <div className="flex gap-1">
                          {/*<AnchorLink*/}
                          {/*  href='/'*/}
                          {/*  className='inline-flex items-center text-xs text-gray-600 dark:text-gray-400'*/}
                          {/*>*/}
                          {/*  {[]}*/}
                          {/*  /!*<Verified className='ltr:ml-1 rtl:mr-1'/>*!/*/}
                          {/*</AnchorLink>*/}
                          <Image
                            className={"w-1.5/12"}
                            src={"/assets/Icon/attack.svg"}
                            alt={""}
                            width={25}
                            height={10}
                          />
                          <p>{nft[AttributeMapping["attack"]].toString()}</p>
                          <Image
                            className={"w-1.5/12 ml-5"}
                            src={"/assets/Icon/defense.svg"}
                            alt={""}
                            width={25}
                            height={10}
                          />
                          <p>{nft[AttributeMapping["defense"]].toString()}</p>
                        </div>
                      </div>
                      <div className={"grid grid-cols-3 gap-2"}>
                        <Button
                          shape={"rounded"}
                          size={"large"}
                          onClick={() => {}}
                        >
                          <Image
                            src={"/assets/Icon/sell.svg"}
                            alt={"sell"}
                            height={30}
                            width={30}
                          />
                        </Button>
                        <Button
                          shape={"rounded"}
                          size={"large"}
                          onClick={() => {}}
                        >
                          <div
                            className={
                              "flex flex-row items-center gap-2 uppercase"
                            }
                          >
                            <Image
                              src={"/assets/Icon/level-up-button.svg"}
                              alt={"level up"}
                              height={30}
                              width={30}
                            />
                            ascend
                          </div>
                        </Button>
                      </div>
                      {/*<div className="block">*/}
                      {/*  <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">*/}
                      {/*    Type*/}
                      {/*  </h3>*/}
                      {/*  <div className="flex flex-col gap-2 w-fit">*/}
                      {/*    <div className={'rounded-full p-2 ' + MapBackgroundType.get(nft.type)}>*/}
                      {/*      <Image src={'/assets/Icon/' + nft.type + '.svg'} alt={'star'} height={25} width={25}/>*/}
                      {/*    </div>*/}

                      {/*    /!*{block_chains?.map((item: any) => (*!/*/}
                      {/*    /!*  <AnchorLink*!/*/}
                      {/*    /!*    href="#"*!/*/}
                      {/*    /!*    className="inline-flex"*!/*/}
                      {/*    /!*    key={item?.id}*!/*/}
                      {/*    /!*  >*!/*/}
                      {/*    /!*    <ListCard*!/*/}
                      {/*    /!*      item={item}*!/*/}
                      {/*    /!*      className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"*!/*/}
                      {/*    /!*    />*!/*/}
                      {/*    /!*  </AnchorLink>*!/*/}
                      {/*    /!*))}*!/*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </div>
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <div className="flex flex-col-reverse">
                      {/*{nftData?.bids?.map((bid) => (*/}
                      {/*  <FeaturedCard*/}
                      {/*    item={bid}*/}
                      {/*    key={bid?.id}*/}
                      {/*    className="mb-3 first:mb-0"*/}
                      {/*  />*/}
                      {/*))}*/}
                    </div>
                  </TabPanel>
                  <TabPanel className="focus:outline-none">
                    <div className="flex flex-col-reverse">
                      {/*{nftData?.history?.map((item) => (*/}
                      {/*  <FeaturedCard*/}
                      {/*    item={item}*/}
                      {/*    key={item?.id}*/}
                      {/*    className="mb-3 first:mb-0"*/}
                      {/*  />*/}
                      {/*))}*/}
                    </div>
                  </TabPanel>
                </ParamTab>
              </Suspense>
            </div>
          </div>
          {/*<NftFooter*/}
          {/*  className="hidden md:block"*/}
          {/*  currentBid={nftData?.bids[nftData?.bids?.length - 1]}*/}
          {/*  auctionTime={Date.now() + 4000000 * 10}*/}
          {/*  isAuction={isAuction}*/}
          {/*  price={price}*/}
          {/*/>*/}
        </div>
        {/*<NftFooter*/}
        {/*  currentBid={nftData?.bids[nftData?.bids?.length - 1]}*/}
        {/*  auctionTime={Date.now() + 4000000 * 10}*/}
        {/*  isAuction={isAuction}*/}
        {/*  price={price}*/}
        {/*/>*/}
      </div>
    </div>
  )
}
