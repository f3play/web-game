import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { router } from "next/client"
import Button from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Opponent } from "@/models/opponent"
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { TournamentContract } from "@/config/contracts"

// @ts-ignore
export default function ChallengeConfigDialog({
  isOpen,
  setIsOpen,
  opponent,
  nftInfos,
}: {
  isOpen: boolean
  setIsOpen: any
  opponent: any
  nftInfos: any
}) {
  const router = useRouter()

  //define call battle
  const { config: callBattleConfig } = usePrepareContractWrite({
    ...TournamentContract,
    functionName: "battle",
  })

  const { data, write: callBattle } = useContractWrite(callBattleConfig)

  const { isLoading: battleLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (receipt) => {
      console.log("receipt", receipt)
    },
    onError: (error) => {
      console.log("error", error)
    },
  })

  // end call battle
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsOpen(false)
          }}
        >
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
                  className="grid w-4/12 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl pb-5
                     align-middle shadow-xl transition-all dark:bg-gray-700"
                >
                  <div className={"title bg-text-500/20 p-5"}>
                    <p className={"text-2xl font-semibold"}>
                      Are you sure want to challenge this player?
                    </p>
                  </div>
                  <div
                    className={
                      "mx-auto grid w-11/12 grid-cols-3 rounded-xl bg-white p-6 dark:bg-light-dark"
                    }
                  >
                    <div className={"place-self-center p-2"}>
                      <Image
                        className={"mx-auto"}
                        src={"/assets/Icon/player.svg"}
                        alt={"player"}
                        width={50}
                        height={50}
                      />
                      <p>BP: ---</p>
                    </div>
                    <div className={"place-self-center p-2"}>
                      <Image
                        className={"mx-auto"}
                        src={"/assets/Icon/versus.svg"}
                        alt={"versus"}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className={"place-self-center p-2"}>
                      <Image
                        className={"mx-auto"}
                        src={"/assets/Icon/player.svg"}
                        alt={"player"}
                        width={50}
                        height={50}
                      />
                      <p>
                        BP:{" "}
                        {nftInfos?.reduce(
                          (acc, item) => acc + item.attack,
                          0,
                        ) || 0}
                      </p>
                    </div>
                  </div>
                  <div className={"actions flex w-full justify-center gap-2"}>
                    <Button
                      shape={"rounded"}
                      size={"large"}
                      onClick={() => {
                        callBattle()
                        // router.push('tournament/fighting')
                      }}
                    >
                      Challenge
                    </Button>
                    <Button
                      shape={"rounded"}
                      size={"large"}
                      onClick={() => setIsOpen(false)}
                    >
                      No
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
