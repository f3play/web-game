import { Fragment, useRef } from "react"
import { Transition } from "@/components/ui/transition"
import { Dialog } from "@/components/ui/dialog"
import treasure from "@/assets/images/lottie/treasure.json"
import { useLottie } from "lottie-react"
import Button from "@/components/ui/button"
import classNames from "classnames"
import toast from "react-hot-toast"
import Image from "next/image"
import { Poppins } from "next/font/google"
import { Close } from "@/components/icons/close"
import Treasure from "@/components/ui/treasure-lottie";

const MaxBoxes = 10
const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function BoxOpenConfirmDialog({
  isOpen,
  setIsOpen,
  boxBalance,
  write,
  openQuantity,
  setOpenQuantity,
  loading,
}: {
  isOpen: boolean
  setIsOpen: any
  boxBalance: number
  write: any
  openQuantity: number
  setOpenQuantity: any
  loading: boolean
}) {
  const treasureRef = useRef()

  function onChangeOpenQuantity(event: any) {
    setOpenQuantity(event.target.value)
  }

  const onSetMaxOpen = () => {
    if (boxBalance >= 10) {
      setOpenQuantity(10)
    } else {
      setOpenQuantity(Number(boxBalance))
    }
  }

  function onOpenBox() {
    if (openQuantity <= 0) {
      toast.error("Please fill open boxes quantity.")
      return
    }
    if (openQuantity > MaxBoxes) {
      toast.error("Maximum box open limit: 10 boxes.")
      return
    }
    if (openQuantity > boxBalance) {
      toast.error("Insufficient Boxes to Open")
      return
    }
    write?.()
  }

  // TODO: display empty balance
  if (!boxBalance) boxBalance = 0

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
                  className="grid w-5/12 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl bg-gray-700
                     pb-5 align-middle shadow-xl transition-all"
                >
                  <div className={"title relative bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>SUMMON</p>
                    {!loading && (
                      <Close
                        className={
                          "absolute right-4 top-4 h-5 w-5 text-slate-400 opacity-80 hover:scale-105 hover:opacity-100"
                        }
                        onClick={() => {
                          setIsOpen(false)
                        }}
                      ></Close>
                    )}
                  </div>
                  <div>
                    {/*<Treasure ref={treasureRef}/>*/}
                    {/*<Image*/}
                    {/*  src={"/assets/Icon/treasure-lottie.png"}*/}
                    {/*  className={"mx-auto"}*/}
                    {/*  alt={"treasure"}*/}
                    {/*  width={200}*/}
                    {/*  height={200}*/}
                    {/*/>*/}

                    <div className={"mx-auto flex w-fit flex-col gap-y-5 -translate-y-10"}>
                      <Treasure />
                    </div>
                    <p
                      className={
                        "text-base uppercase text-amber-500 subpixel-antialiased"
                      }
                    >
                      Your Boxes
                    </p>
                    <p
                      className={classNames(poppin_font.className, "text-3xl")}
                    >
                      {boxBalance.toString()}
                    </p>
                    <div className={"relative mx-auto mt-5 w-4/12"}>
                      <input
                        max={10}
                        type="number"
                        onChange={onChangeOpenQuantity}
                        value={openQuantity}
                        placeholder={"10"}
                        className={classNames(
                          "w-full rounded border p-2 text-lg outline-none ring-1" +
                            " select-all bg-slate-800/50 text-white",
                          openQuantity <= 10
                            ? "border-blue-600 ring-blue-600"
                            : "invalid:border-rose-800 invalid:ring-rose-800",
                        )}
                      />
                      <button
                        onClick={() => onSetMaxOpen()}
                        className="focus:ring-none absolute right-2.5 top-1
                                 rounded-lg bg-transparent px-4 py-2 text-base font-medium
                                  text-blue-500 hover:font-semibold hover:text-slate-200 focus:outline-none"
                      >
                        MAX
                      </button>
                    </div>

                    <div
                      className={
                        "mx-auto flex w-4/12 justify-between gap-2 px-3"
                      }
                    >
                      <Button
                        onClick={() => onOpenBox()}
                        className={"mt-5 w-full"}
                        shape={"rounded"}
                        isLoading={loading}
                        disabled={loading || openQuantity > 10}
                      >
                        Summon
                      </Button>
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
