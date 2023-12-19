"use client"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Image from "next/image"
import { Button } from "@/components/Base/Button"

export default function BattleHistory({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: any
}) {
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
                  className="grid w-4/12 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl bg-gray-700
                     pb-5 align-middle shadow-xl transition-all"
                >
                  <div className={"title bg-text-500/20 p-5"}>
                    <p className={"text-2xl font-semibold"}>
                      Battle Ranking
                    </p>
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
