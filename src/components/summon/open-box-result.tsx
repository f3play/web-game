import { Transition } from "@/components/ui/transition"
import { Fragment, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import classNames from "classnames"
import { useAccount } from "wagmi"
import NftGrid from "@/app/shared/nft-grid"
import { heroFromAttributes } from "@/models/hero"
import { Close } from "@/components/icons/close"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { ethers } from "ethers"
import Image from "next/image"
import { sleep } from "@/utils/number"
import {DotLottiePlayer} from "@dotlottie/react-player";
import TxHyperLink from "@/components/ui/scan-hyperlink";

const itemMotion = {
  hidden: { scale: 0 },
  show: { scale: 1 },
}

export function ListHero({ nfts, nftIds }: { nfts: []; nftIds: [] }) {
  return (
    <>
      {nfts?.map((res: any, idx) => {
        const hero = heroFromAttributes(nftIds[idx], res.result)
        return (
          <motion.div variants={itemMotion} key={idx}>
            <NftGrid
              nft={hero}
              className={
                "mx-auto h-64 w-48 select-none place-self-center hover:scale-105"
              }
              showActions={false}
            />
          </motion.div>
        )
      })}
    </>
  )
}

export default function OpenBoxResultDialog({
  isOpen,
  setIsOpen,
  nfts,
  nftIds,
  amount,
  openSuccess,
  setOpenSuccess,
  txHash,
}: // myHistoryCount,
{
  isOpen: boolean
  setIsOpen: any
  nfts: []
  nftIds: []
  amount: bigint
  openSuccess: boolean
  setOpenSuccess: any
  txHash: string
}) {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1,
      },
    },
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() => {
            // setIsOpen(false)
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-80"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-80"
          >
            <div className="fixed inset-0 bg-[#0D1321] bg-opacity-95" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="grid w-full transform grid-cols-1 rounded-2xl
                     bg-transparent align-middle shadow-xl transition-all"
                >
                  {openSuccess &&
                    <div
                      className={"text-gray-500/80 hover:text-gray-200"}
                      onClick={() => {
                        // setOpenSuccess(false)
                        setIsOpen(false)
                      }}
                    >
                      <Close className={"absolute right-10 top-10 h-10 w-10"} />
                    </div>
                  }
                  <div className={"flex h-full flex-col justify-between gap-5"}>
                    <div className={"flex flex-col gap-5"}>
                      {!openSuccess && (
                        <motion.div
                          animate={{ opacity: 1,}}
                          className={"grid h-[100vh]"}
                          exit={{ opacity: 0}}
                          initial={{ opacity: 0 }}
                        >
                          <DotLottiePlayer src={'/assets/Icon/treasure.lottie'} className={'w-72 h-72 place-self-center'}
                                           autoplay
                                           loop/>
                        </motion.div>
                      )}

                      {openSuccess && (
                        <>
                          <motion.div
                            variants={container}
                            initial="hidden"
                            animate={
                              nfts.length > 0
                                ? "show"
                                : "hidden"
                            }
                            className={classNames(
                              "mx-auto grid h-[100vh] w-full place-content-evenly gap-5 p-16",
                              nfts.length > 5
                                ? "grid-cols-5"
                                : "grid-cols-" + nfts.length,
                            )}
                          >
                            <ListHero nfts={nfts} nftIds={nftIds} />
                            <motion.div
                              variants={itemMotion}
                              className={classNames(
                                "mx-auto w-fit items-center gap-0.5 text-2xl text-amber-300 subpixel-antialiased",
                                nfts.length > 5
                                  ? "col-span-5"
                                  : "col-span-" + nfts.length,
                              )}
                            >
                              <Image
                                className={"mx-auto"}
                                alt={"moneybag"}
                                src={"/assets/Icon/money-bag.png"}
                                height={100}
                                width={100}
                              />
                              <div className={"mx-auto flex items-center justify-center"}>
                                <p className={"align-middle text-3xl"}>
                                  {ethers
                                    .formatEther(amount)
                                    .replace(/\.0$/, "")}
                                </p>
                                <Image
                                  src={"/assets/Icon/logo.svg"}
                                  alt={""}
                                  height={37}
                                  width={37}
                                />
                              </div>
                              <TxHyperLink txHash={txHash}/>
                            </motion.div>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
