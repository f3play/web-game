import { NFT } from "@/models/nft"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Button from "@/components/ui/button"
import classNames from "classnames"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { useListAllNFT } from "@/hooks/useNFTBalance"
import { useNFTIsApproveForAll } from "@/hooks/useNFTApproval"
import { useMultiNFTAttribute } from "@/hooks/useNFT"
import NftGrid from "@/app/shared/nft-grid"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import {
  PandaNFTContract,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { Hero } from "@/models/hero"

const squadLimit = 3

export default function ChooseHeroesDialog({
  listHeroes,
  isOpen,
  setIsOpen,
  refetch,
}: {
  listHeroes: NFT[]
  isOpen: boolean
  setIsOpen: any
  refetch: any
}) {
  const { address: account } = useAccount()

  // @ts-ignore
  const { data: playerStatistics, refetch: refetchPlayerInfo } =
    useGamePlayerInfo(account, 0)

  const [refetchOwnedNft, setRefetchOwnedNft] = useState(true)

  const [lineUpIds, setLineUpIds] = useState([])
  const [lineUpIdsOriginal, setLineUpIdsOriginal] = useState([])
  const [pickSquadParam, setPickSquadParam] = useState([])
  const { data: nfts, refetch: refetchListNfts } = useListAllNFT(account)

  const isLineUpDirty = () => {
    return (
      lineUpIdsOriginal.filter((i) => !lineUpIds.includes(i)).length ||
      lineUpIds.filter((i) => !lineUpIdsOriginal.includes(i)).length
    )
  }

  const refetchData = () => {
    refetch()
    refetchPlayerInfo()
    refetchListNfts()
    setRefetchOwnedNft(!refetchOwnedNft)
  }

  useEffect(() => {
    let result = [...lineUpIds]
    let resultLength = result.length
    for (let temp = 0; temp < squadLimit - resultLength; temp++) {
      result.push("0")
    }

    let i = 0
    while (i < squadLimit) {
      let pass = false
      while (!pass) {
        if (result[i] == "0") {
          pass = true
        }

        let idx = lineUpIdsOriginal.indexOf(result[i])
        if (idx == -1 || idx == i) {
          pass = true
        } else {
          result[i] = result[idx]
          result[idx] = lineUpIdsOriginal[idx]
        }
      }
      i++
    }
    setPickSquadParam(result)
  }, [lineUpIds])

  const isNFTApproved = useNFTIsApproveForAll(account)

  const { config } = usePrepareContractWrite({
    ...TournamentContract,
    functionName: "pickSquad",
    args: [pickSquadParam],
    enabled: !!pickSquadParam.length && isLineUpDirty() && isNFTApproved,
  })

  const allNFTs = () => {
    const nftSelected = nftInfoParsed.filter(
      (item: Hero) => item.id.toString() != "0",
    )
    const nftsSorted = nfts.sort(
      (a: Hero, b: Hero) => b.attack + b.defense - a.attack - a.defense,
    )
    return [...nftSelected, ...nftsSorted]
  }

  const {
    data,
    isLoading,
    isSuccess,
    write: callUpdateDefenseTeam,
  } = useContractWrite(config)

  const { isLoading: confirmLoading, isSuccess: confirmSuccessed } =
    useWaitForTransaction({
      hash: data?.hash,
      onSuccess: (receipt) => {
        if (receipt.status == "success") {
          toast.success("Update squad successfully")
          refetchData()
          setIsOpen(false)
        } else {
          toast.error("Update squad failed")
        }
      },
      onError: (error) => {
        console.log("update squad error", error)
        toast.error("Update squad failed")
      },
    })

  useEffect(() => {
    // @ts-ignore
    setLineUpIdsOriginal(
      !playerStatistics ? [] : playerStatistics?.squad.map((i) => i.toString()),
    )
  }, [playerStatistics])

  useEffect(() => {
    // @ts-ignore
    setLineUpIds(lineUpIdsOriginal.filter((i) => i != "0"))
  }, [lineUpIdsOriginal])

  function checkExisted(id: string) {
    return lineUpIds.some((heroId) => heroId == id)
  }

  function onChoose(id: string) {
    var index = lineUpIds.indexOf(id)
    if (index !== -1) {
      const newLineUpIds = lineUpIds.filter((i) => i != id)
      setLineUpIds(newLineUpIds)
      return
    }

    if (lineUpIds.length >= squadLimit) {
      toast.error("Your squad has reach limit members")
    } else {
      // @ts-ignore
      setLineUpIds((current) => [...current, id])
    }
  }

  const nftInfoParsed = useMultiNFTAttribute(lineUpIdsOriginal || [])
  const nftInfosSelected = () => {
    return lineUpIds
      .filter((id) => id != "0")
      .map((id) => allNFTs().find((item) => item.id == id))
  }

  // define call approveForAll
  const { config: approveConfig } = usePrepareContractWrite({
    ...PandaNFTContract,
    functionName: "setApprovalForAll",
    args: [TournamentAddress, true],
  })

  const { data: approveData, write: callApproveForAll } =
    useContractWrite(approveConfig)

  const { isLoading: approveLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: (receipt) => {
      console.log("approve success", receipt)
      if (receipt.status == "success") {
        toast.success("Approve successfully")
      } else {
        toast.error("Approve failed")
      }
    },
    onError: (error) => {
      console.log("approve error", error)
      toast.error("Approve failed")
    },
  })

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
                  className="grid w-7/12 scale-75 transform grid-cols-1 place-content-center gap-5 overflow-hidden rounded-2xl bg-gray-700 pb-5
                     align-middle shadow-xl transition-all xl:scale-90"
                >
                  <div className={"title bg-[#0D1321]/60 p-5"}>
                    <p className={"text-2xl font-semibold"}>Pick line up</p>
                  </div>
                  <div
                    className={
                      "mx-auto w-11/12 rounded-xl bg-blue-950/60 p-5 text-xl"
                    }
                  >
                    <div className={"w-full"}>
                      <h3 className={"mx-auto w-fit"}>Your squad</h3>
                      {/* <p className={'w-full text-right text-base'}>
                        Battle point:{' '}
                        {lineUpNFT.reduce((acc, item) => acc + item.attack, 0)}
                      </p> */}
                    </div>
                    <div
                      className={
                        "mx-auto grid h-56 w-full grid-cols-5 gap-4 overflow-auto text-xs"
                      }
                    >
                      <div className="col-span-1"></div>
                      {nftInfosSelected()?.map((hero, idx) => {
                        return (
                          <div key={idx}>
                            {hero && (
                              <div
                                key={hero.id}
                                className="hover:cursor-pointer"
                                onClick={() => onChoose(hero.id.toString())}
                              >
                                {hero && (
                                  <NftGrid
                                    key={hero.id}
                                    nft={hero}
                                    className={"w-44 mx-auto h-56"}
                                    nftId={hero.id}
                                    isMotion={false}
                                  ></NftGrid>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div
                    className={
                      "mx-auto grid h-[480px] w-11/12 gap-x-4 gap-y-8 overflow-auto rounded-xl bg-blue-950/60 p-5 text-xs lg:grid-cols-4 xl:grid-cols-5"
                    }
                  >
                    
                    {allNFTs()?.map((hero, idx) => {
                      return (
                        <div
                          key={idx}
                          className={classNames(
                            "relative h-[200px] hover:scale-105 hover:cursor-pointer",
                          )}
                          onClick={() => onChoose(hero?.id.toString())}
                        >
                          {checkExisted(hero?.id) && (
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
                          {hero && (
                            <NftGrid
                              nft={hero}
                              detailNavigate={true}
                              showActions={false}
                              nftId={hero?.id}
                              isMotion={false}
                              className={classNames(
                                "w-44 mx-auto h-56",
                                checkExisted(hero?.id) ? " opacity-25" : "",
                              )}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className={
                      "actions mx-auto flex w-full justify-center gap-2"
                    }
                  >
                    {isNFTApproved ? (
                      <Button
                        shape={"rounded"}
                        size={"small"}
                        isLoading={confirmLoading}
                        onClick={() => callUpdateDefenseTeam()}
                        disabled={!isLineUpDirty() || confirmLoading}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <Button
                        shape={"rounded"}
                        size={"small"}
                        isLoading={approveLoading}
                        onClick={() => callApproveForAll()}
                        disabled={approveLoading || confirmLoading}
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      shape={"rounded"}
                      size={"small"}
                      onClick={() => {
                        setIsOpen(false)
                        setLineUpIds(lineUpIdsOriginal)
                      }}
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
