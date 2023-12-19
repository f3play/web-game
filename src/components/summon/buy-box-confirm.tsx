"use client"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import classNames from "classnames"
import {PandaBoxAddress, PandaBoxContract, PandaTokenContract} from "@/config/contracts";

export function BuyBoxAction({
  isLoading,
  setIsLoading,
  buyQuantity,
}: {
  isLoading: boolean
  setIsLoading: any
  buyQuantity: number
}) {
  const router = useRouter()
  const { config } = usePrepareContractWrite({
    ...PandaBoxContract,
    functionName: "buyBox",
    args: [buyQuantity],
  })

  const { write, data, isLoading: buyCfgLoading } = useContractWrite(config)
  let { isLoading: buyLoading, isSuccess: success } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      router.push("/summon?view=my-box")
    },
  })
  useEffect(() => {
    setIsLoading(buyLoading || buyCfgLoading)
  }, [buyCfgLoading, buyLoading])
  return (
    <>
      <Button
        isLoading={isLoading}
        disabled={!write || isLoading}
        shape={"rounded"}
        size={"medium"}
        onClick={() => write?.()}
      >
        Confirm
      </Button>
    </>
  )
}

export function ApproveAction({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean
  setIsLoading: any
}) {
  const { config: approveTokenCfg } = usePrepareContractWrite({
    ...PandaTokenContract,
    functionName: "approve",
    args: [PandaBoxAddress, 9999],
  })

  const {
    write: writeApproveToken,
    data: approveTokenData,
    isLoading: approveCfgLoading,
  } = useContractWrite(approveTokenCfg)
  let { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveTokenData?.hash,
  })

  useEffect(() => {
    setIsLoading(approveLoading || approveCfgLoading)
  }, [approveLoading, approveCfgLoading])
  return (
    <>
      <Button
        isLoading={isLoading}
        disabled={!writeApproveToken || isLoading}
        shape={"rounded"}
        size={"medium"}
        onClick={() => writeApproveToken?.()}
      >
        Approve
      </Button>
    </>
  )
}

// @ts-ignore
export default function BuyBoxConfirmDialog({ isOpen, setIsOpen, box }) {
  const router = useRouter()
  const { address } = useAccount()
  let [isLoading, setIsLoading] = useState(false)
  let [isApproved, setIsApproved] = useState(false)
  let [buyQuantity, setBuyQuantity] = useState(0)
  const boxPrice = 10000000000000n

  // @ts-ignore
  const { data: allowance } = useContractRead({
    ...PandaTokenContract,
    functionName: "allowance",
    args: [address, PandaBoxAddress],
  })

  useEffect(() => {
    setIsApproved(allowance > boxPrice)
  }, [allowance])

  function onChangeQuantity(event: any) {
    setBuyQuantity(event.target.value)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#0D1321] bg-opacity-80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                  className="grid w-4/12 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl bg-gray-700
                     pb-5 align-middle shadow-xl transition-all"
                >
                  <div className={"title bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>Buy Box Confirm:</p>
                  </div>
                  <Image
                    className={"mx-auto w-5/12 rounded-xl"}
                    src={box.img}
                    alt={"pack nfts"}
                    width={500}
                    height={50}
                  />
                  <div className="mx-auto grid w-5/12 gap-2">
                    <input
                      type="number"
                      onChange={onChangeQuantity}
                      value={buyQuantity}
                      placeholder={""}
                      inputMode="numeric"
                      // onChange={handleBoxNumbChange}
                      className={classNames(
                        "w-full rounded border-0 p-2 text-lg outline-none ring-2" +
                          " text-gray-500 dark:bg-light-dark",
                      )}
                    />
                    <div
                      className={"flex flex-row-reverse items-center gap-x-2"}
                    >
                      <p className={""}>{buyQuantity * 1} PDA</p>
                    </div>
                  </div>
                  <div className={"actions flex w-full justify-center gap-2"}>
                    {(isApproved && (
                      <BuyBoxAction
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        buyQuantity={buyQuantity}
                      />
                    )) || (
                      <ApproveAction
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    )}
                    <div></div>
                    <Button
                      disabled={isLoading}
                      isLoading={isLoading}
                      shape={"rounded"}
                      size={"medium"}
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </Button>
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
