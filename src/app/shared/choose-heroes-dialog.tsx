import { NFT } from "@/models/nft"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { MapBackgroundType } from "@/utils/styles"
import Image from "next/image"
import toast from "react-hot-toast"
import Button from "@/components/ui/button"
import classNames from "classnames"
import NftGrid from "@/components/my-nfts/nft-grid"

const squadLimit = 3

export default function ChooseHeroesDialog({
  listHeroes,
  setLineUp,
  isOpen,
  setIsOpen,
  lineUp,
}: {
  listHeroes: NFT[]
  setLineUp: any
  isOpen: boolean
  setIsOpen: any
  lineUp: NFT[]
}) {
  function checkExisted(id: number) {
    return lineUp.some((hero) => hero.id === id)
  }

  function chosenStyle(id: number) {
    if (checkExisted(id)) {
      return "opacity-40 grayscale "
    } else {
      return ""
    }
  }

  function onChoose(nft: NFT) {
    if (checkExisted(nft.id)) {
      // @ts-ignore
      setLineUp((current) =>
        // @ts-ignore
        current.filter((hero) => {
          return hero.id !== nft.id
        }),
      )
    } else if (lineUp.length >= squadLimit) {
      toast.error("Your squad has reach limit members")
    } else {
      // @ts-ignore
      setLineUp((current) => [...current, nft])
    }
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
                  <div className={"title bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>Pick line up</p>
                  </div>
                  <div
                    className={
                      "mx-auto w-11/12 rounded-xl bg-blue-950/60 p-5 text-xl"
                    }
                  >
                    <h3 className={"mx-auto w-fit"}>Your squad</h3>
                    <div
                      className={
                        "mx-auto grid h-80 w-8/12 grid-cols-3 gap-5 overflow-auto text-xs"
                      }
                    >
                      {lineUp.map((hero, idx) => {
                        return (
                          <NftGrid
                            nft={hero}
                            className={"h-fit place-self-center"}
                            detailNavigate={false}
                            key={hero.id}
                          />
                        )
                      })}
                    </div>
                  </div>
                  <div
                    className={
                      "mx-auto grid h-96 w-11/12 gap-5 overflow-auto rounded-xl bg-blue-950/60 p-5 text-xs lg:grid-cols-4 xl:grid-cols-5"
                    }
                  >
                    {listHeroes.map((hero, idx) => {
                      return (
                        <div
                          key={hero.id}
                          className={"relative hover:cursor-pointer"}
                          onClick={() => onChoose(hero)}
                        >
                          {checkExisted(hero.id) && (
                            <Image
                              alt={"checked"}
                              src={"/assets/Icon/checked.svg"}
                              className={
                                "absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transform"
                              }
                              width={50}
                              height={50}
                            />
                          )}
                          <div
                            className={classNames(
                              "relative overflow-hidden rounded-lg bg-white shadow transition-all duration-200 hover:shadow-large dark:bg-light-dark",
                              checkExisted(hero.id) && "opacity-25",
                            )}
                          >
                            <Image
                              src={hero.img}
                              width={450}
                              height={450}
                              alt=""
                            />
                            <div
                              className={
                                "absolute left-3 top-3 rounded-full p-1.5 " +
                                MapBackgroundType.get(hero.type)
                              }
                            >
                              <Image
                                src={"/assets/Icon/" + hero.type + ".svg"}
                                alt={"star"}
                                height={15}
                                width={15}
                              />
                            </div>

                            <div className="p-5">
                              <p className="text-left text-lg font-medium text-black dark:text-white">
                                {hero.name}
                              </p>
                              <div
                                className={
                                  "mt-1.5 flex flex-row items-center gap-2"
                                }
                              >
                                <div className="flex items-center">
                                  <Image
                                    className={"w-1.5/12"}
                                    src={"/assets/Icon/attack.svg"}
                                    alt={""}
                                    width={20}
                                    height={10}
                                  />
                                  <p>{hero.attack}</p>
                                  <Image
                                    className={"w-1.5/12 ml-2"}
                                    src={"/assets/Icon/defense.svg"}
                                    alt={""}
                                    width={20}
                                    height={10}
                                  />
                                  <p>{hero.defend}</p>
                                </div>
                                <p>Lv.{hero.level}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className={
                      "actions mx-auto flex w-full justify-center gap-2"
                    }
                  >
                    <Button
                      shape={"rounded"}
                      size={"large"}
                      onClick={() => setIsOpen(false)}
                    >
                      Confirm
                    </Button>
                    <Button
                      shape={"rounded"}
                      size={"large"}
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
