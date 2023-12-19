import {Dialog, Transition} from "@headlessui/react";
import {Fragment} from "react";
import Image from "next/image";
import CloseIcon from "/assets/Icon/close.svg"

// @ts-ignore
export default function NFTDialog({isOpen, setIsOpen, nftImage}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {setIsOpen(false)}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-text-500 bg-opacity-50"/>
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
                  className="w-5/12 transform overflow-hidden rounded-2xl bg-primary-500 grid grid-cols-1 gap-5
                      text-left align-middle shadow-xl transition-all relative">
                  <span className={"fixed top-3 right-3"} onClick={() => setIsOpen(false)}>
                    <Image className={"rounded-2xl scale-75 hover:scale-100 duration-150"} src={"/assets/Icon/close.svg"} alt={""} width={30} height={30}/>
                  </span>
                  <div className="flex flex-nowrap text-lg">
                    <Image className={"w-7/12 rounded-l-2xl border-text-500"} src={nftImage}
                           alt={"image"}
                           width={300} height={300}/>
                    <div className={"p-5 py-10 w-5/12"}>
                      <p className={"text-2xl font-semibold"}>Super Panda</p>
                      <p className={"text-xs text-opacity-70 italic"}>Lvl.100</p>
                      <div>
                        <div className={"flex justify-between"}>
                          <b>HP</b>
                          <p>100</p>
                        </div>
                        <div className={"flex justify-between"}>
                          <b>Attack</b>
                          <p>100</p>
                        </div>
                        <div className={"flex justify-between"}>
                          <b>Defense</b>
                          <p>100</p>
                        </div>
                      </div>

                      <div className={"mx-auto gap-x-3 flex justify-center mt-4"}>
                        <button
                          className={"bg-minor-500/30 hover:bg-minor-600/50 shadow-md  rounded-lg font-bold text-white border-none px-3 py-1"}>
                          Level Up
                        </button>
                        <button
                          className={"rounded-lg font-bold text-white border-none px-3 py-1"}>
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>

                  {/*<div className="mt-4">*/}
                  {/*  <button*/}
                  {/*    type="button"*/}
                  {/*    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"*/}
                  {/*    onClick={closeModal}*/}
                  {/*  >*/}
                  {/*    Got it, thanks!*/}
                  {/*  </button>*/}
                  {/*</div>*/}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}