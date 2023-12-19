import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import Button from "@/components/ui/button"
import { MaterialNFT } from "./material-nft"
import { parseRarityToInt, useMultiNFTAttribute } from "@/hooks/useNFT"
import {
  useListAllNFT,
  useNFTBalance,
  useNFTListTokenIdsOwned,
} from "@/hooks/useNFTBalance"
import { useAccount } from "wagmi"
import { toast } from "react-hot-toast"
import { NftSquareItem } from "@/app/shared/nft-square-item"
import { parseRarity } from "@/utils/nft"

export const SelectUpgradeNFTDialog = ({
  nft,
  isOpen,
  setIsOpen,
  requirement,
  materialSelected,
  updateMaterialSelected,
  materialNFTs,
  setMaterialNFTs,
}: {
  nft: any
  isOpen: boolean
  setIsOpen: any
  requirement: number[]
  materialSelected: number[]
  updateMaterialSelected: any
  materialNFTs: number[]
  setMaterialNFTs: any
}) => {
  const { address: account } = useAccount()
  const { data: nftBalance, refetch: refetchNftBalance } =
    useNFTBalance(account)
  const { data: nfts, refetch: refetchNfts } = useListAllNFT(account)

  useEffect(() => {
    refetchNftBalance()
    refetchNfts()
  }, [requirement])

  const onSelectItem = (hero: any) => {
    let selected = materialSelected
    let rarityInt = parseRarityToInt(hero.rarity)

    // const idx = materialNFTs.indexOf(hero.id)
    const checkMaterialIds = materialNFTs.filter((i) => i.id != hero.id)
    if (checkMaterialIds.length < materialNFTs.length) {
      setMaterialNFTs(checkMaterialIds)
      selected[rarityInt - 1] -= 1
      updateMaterialSelected(selected)
    } else {
      if (selected[rarityInt - 1] == requirement[rarityInt - 1]) {
        return toast.error("Limit reached")
      }
      setMaterialNFTs([...materialNFTs, hero])

      selected[rarityInt - 1] += 1
      updateMaterialSelected(selected)
    }
  }

  function checkExisted(id: string) {
    return materialNFTs.some((hero) => hero.id == id)
  }

  function chosenStyle(id: string) {
    if (checkExisted(id)) {
      return "opacity-40 grayscale "
    } else {
      return ""
    }
  }

  function usageNFT() {
    if (!requirement) {
      return nfts
    }
    return nfts.filter((hero) => {
      let rarityInt = parseRarityToInt(hero.rarity)
      return (
        requirement[rarityInt - 1] > 0 &&
        hero.element == nft.element &&
        hero.id != nft.id
      )
    })
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
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

          <div className="fixed inset-0 min-h-screen overflow-y-auto">
            <div className="align-items-start mt-auto flex items-center justify-center p-4 text-center">
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
                  className="align-start mt-[5vh] flex h-[85vh] w-5/12 transform grid-cols-1 flex-col gap-5 overflow-hidden
                         rounded-2xl bg-gray-700 pb-5 shadow-xl transition-all"
                >
                  <div className={"title px-[16px] pt-[16px]"}>
                    <p className={"text-2xl font-semibold"}>Select NFT</p>
                  </div>

                  <div className="mx-auto flex justify-center">
                    {requirement?.map((item, idx) => {
                      return item > 0 ? (
                        <MaterialNFT
                          element={nft.element}
                          key={idx}
                          rarity={parseRarity((idx + 1).toString())}
                          neededAmount={item}
                          availableAmount={materialSelected[idx]}
                        ></MaterialNFT>
                      ) : (
                        <div key={idx}></div>
                      )
                    })}
                  </div>
                  <div className="mx-[32px] flex grow flex-col overflow-y-auto">
                    <p className="mb-[8px] text-left text-sm">
                      NFTs that can be used to upgrade
                    </p>
                    <div className="no-scrollbar flex-grow overflow-y-scroll rounded-lg bg-white dark:bg-light-dark">
                      <div className="grid w-full grid-cols-5 gap-x-[12px] gap-y-[12px]  p-[16px]">
                        {usageNFT().map((hero, idx) => {
                          return (
                            <NftSquareItem
                              key={hero.id}
                              nft={hero}
                              isChosen={checkExisted(hero.id)}
                              onClick={() => onSelectItem(hero)}
                            ></NftSquareItem>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      shape={"rounded"}
                      size={"small"}
                      onClick={() => {
                        setIsOpen(false)
                        // setLineUpIds(lineUpIdsOriginal);
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
