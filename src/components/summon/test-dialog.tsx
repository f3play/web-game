import { Transition } from "@/components/ui/transition"
import {Fragment, useState} from "react"
import { Dialog } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import classNames from "classnames";

export default function TestDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: any
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

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
                  className="grid w-8/12 scale-75 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl bg-gray-700
                     pb-5 align-middle shadow-xl transition-all"
                >

                  <div className="scene scene--card" onClick={() => toggleFlip()}>
                    <div className={classNames("card", isFlipped ? "is-flipped": "")}>
                      <div className="card__face card__face--front">front</div>
                      <div className={classNames("card__face card__face--back", "bg-common bg-cover")}>back</div>
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
