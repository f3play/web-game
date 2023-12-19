"use client"

import { useEffect, useState } from "react"
import { NFTS_YOUR_NFT_BALANCE } from "@/utils/constants"
import { useAccount, useContractRead, useContractReads } from "wagmi"
import { useGridSwitcher } from "@/lib/hooks/use-grid-switcher"
import { elements, NFTFilters, rarities } from "@/components/my-nfts/nft-filter"
import Pagination from "@/app/shared/pagination"
import { motion } from "framer-motion"
import NftList from "@/components/my-nfts/nft-list"
import {
  MultiviewContract,
  PandaNFTAddress,
  PandaNFTContract,
} from "@/config/contracts"
import {GetChainID} from "@/utils";

const PerPage = 10
const LimitRecords = 100

export default function MyNFTs() {
  const { isGridCompact } = useGridSwitcher()
  let [rarityFilter, setRarityFilter] = useState(rarities[0])
  let [typeFilter, setTypeFilter] = useState(elements[0])
  let [nftFiltered, setNftFiltered] = useState([])
  let [pagiList, setPagiList] = useState([])
  let [listNfts, setListNfts] = useState([])
  let [nftInfos, setNftInfos] = useState([])
  let [totalPage, setTotalPage] = useState(0)
  let [currentPage, setCurrentPage] = useState(1)
  let [isLoading, setIsLoading] = useState(true)

  const { address } = useAccount()

  const { data: nftBalance } = useContractRead({
    ...PandaNFTContract,
    functionName: "balanceOf",
    args: [address],
    scopeKey: NFTS_YOUR_NFT_BALANCE,
    onSuccess: (result) => {
      if (result == 0) {
        setIsLoading(false)
      }
    },
  })

  function buildGetListConfig() {
    let configs = []
    const pages = !nftBalance
      ? 0
      : Math.ceil(parseInt(nftBalance.toString()) / LimitRecords)
    for (let i = 0; i < pages; i++) {
      const offset = i * LimitRecords
      configs = [
        ...configs,
        {
          ...MultiviewContract,
          chainId: GetChainID(),
          functionName: "nfts",
          args: [PandaNFTAddress, address, offset, LimitRecords],
        },
      ]
    }
    return configs
  }

  const myNFTsQuery = useContractReads({
    contracts: buildGetListConfig(),
    onSuccess: (result) => {
      let data = []
      result.forEach((item, idx) => {
        data = [...data, ...item.result]
      })
      setListNfts(data)
    },
  })

  function filterNfts() {
    let data = listNfts.filter((nft) => {
      if (rarityFilter.value == 0 && typeFilter.value == 0) {
        return true
      }

      const isRareMatch =
        rarityFilter.value == 0 || nft?.attribute.rarity == rarityFilter.value
      const isTypeMatch =
        typeFilter.value == 0 || nft?.attribute.element == typeFilter.value

      return isRareMatch && isTypeMatch
    })

    setCurrentPage((currenPage) => 1)
    setNftFiltered(data)
  }

  function paginateNFTs() {
    const startIdx = (currentPage - 1) * PerPage
    const endIdx = startIdx + PerPage
    if (nftFiltered && nftFiltered.length > 0) {
      setPagiList(nftFiltered.slice(startIdx, endIdx))
    } else {
      setPagiList([])
    }
  }

  useEffect(() => {
    paginateNFTs()
  }, [currentPage, totalPage, nftFiltered])

  useEffect(() => {
    filterNfts()
  }, [rarityFilter, typeFilter, listNfts])

  function calTotalPage() {
    setTotalPage(Math.ceil(nftFiltered.length / 10))
  }

  useEffect(() => {
    calTotalPage()
  }, [nftFiltered])

  useEffect(() => {
    if (pagiList.length > 0) {
      setIsLoading(false)
    }
  }, [pagiList])

  return (
    <div className="relative h-[70vh] uppercase">
      <div className={"flex h-fit w-full items-center justify-between"}>
        <p className={"font-semibold subpixel-antialiased"}>
          Total: {nftFiltered ? nftFiltered.length : 0}
        </p>
        <div>
          <NFTFilters
            rarity={rarityFilter}
            setRarity={setRarityFilter}
            element={typeFilter}
            setElement={setTypeFilter}
          />
        </div>
      </div>
      <NftList nfts={pagiList} isLoading={isLoading} nftListQuery={myNFTsQuery}/>
      <motion.div className={"flex h-[10vh] w-full justify-center"}>
        <Pagination
          totalPage={totalPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </motion.div>
    </div>
  )
}
