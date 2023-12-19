"use client"

import {
  ElementToNumber,
  Hero,
  HeroElement,
  HeroForSale,
  HeroRarity,
  RarityToNumber,
} from "@/models/hero"
import HeroForSaleList from "./hero-for-sale-list"
import { Address, useContractRead } from "wagmi"
import { MarketplaceContract } from "@/config/contracts"
import { useHeroes } from "@/hooks/hero"
import { useState } from "react"
import Pagination from "@/app/shared/pagination"
import { MKP_HERO_PER_PAGE } from "@/config"
import MarketplaceFilter from "./marketplace-filter"

export default function MarketplaceOnSale() {
  // TODO: use query params

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<{
    address: Address | undefined
    element: HeroElement | undefined
    rarity: HeroRarity | undefined
  }>({
    address: undefined,
    element: undefined,
    rarity: undefined,
  })

  const onlyMyHeroes = filters.address !== undefined

  const {
    data,
    isLoading: isLoadingList,
    isError,
    error,
  } = useContractRead({
    ...MarketplaceContract,
    functionName: "recentListings",
    args: [
      BigInt((currentPage - 1) * MKP_HERO_PER_PAGE),
      BigInt(MKP_HERO_PER_PAGE),
      ElementToNumber(filters.element),
      RarityToNumber(filters.rarity),
    ],
    enabled: !onlyMyHeroes,
  })

  const {
    data: dataMyHeroes,
    isLoading: isLoadingMyHeroes,
    isError: isErrorMyHeroes,
    error: errorMyHeroes,
  } = useContractRead({
    ...MarketplaceContract,
    functionName: "recentListingsBySeller",
    args: [
      BigInt((currentPage - 1) * MKP_HERO_PER_PAGE),
      BigInt(MKP_HERO_PER_PAGE),
      filters.address!,
    ],
    enabled: onlyMyHeroes,
  })

  const total = !onlyMyHeroes
    ? Number(data?.[0] || 0)
    : Number(dataMyHeroes?.[0] || 0)
  const totalPage = Math.ceil(total / MKP_HERO_PER_PAGE)

  const mkpHeroes = !onlyMyHeroes ? data?.[1] || [] : dataMyHeroes?.[1] || []
  const ids = mkpHeroes.map((row) => row.nftIds[0])
  const infos = mkpHeroes.reduce((acc, row) => {
    for (const id of row.nftIds) {
      acc.set(id, row)
    }
    return acc
  }, new Map<bigint, any>())

  const { heroes, isLoading: isLoadingInfo } = useHeroes(ids)

  if (isError) {
    return <div>Error: {error?.message}</div>
  }

  const heroesForSale = heroes
    .map((hero: Hero, idx: number) => {
      const info = infos.get(hero.id)
      if (!info) {
        return undefined
      }

      return {
        ...hero,
        listing: info,
      }
    })
    .filter((hero?: HeroForSale) => !!hero) as HeroForSale[]

  const onFilter = function (filters: {
    address: Address | undefined
    element: HeroElement | undefined
    rarity: HeroRarity | undefined
  }) {
    setCurrentPage(1)
    setFilters(filters)
  }

  const isLoading = isLoadingList || isLoadingInfo || isLoadingMyHeroes
  const isEmpty = heroesForSale.length === 0

  return (
    <div className="flex h-full flex-col">
      <MarketplaceFilter
        filters={filters}
        onFilter={onFilter}
        className="mb-4"
      />
      {isEmpty && !isLoading && NoHeroes(onlyMyHeroes)}
      {!isEmpty && !isLoading && (
        <>
          <HeroForSaleList heroes={heroesForSale} isLoading={isLoading} />
          {totalPage > 1 && (
            <div className={"mt-4 h-full w-full justify-center"}>
              <Pagination
                totalPage={totalPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function NoHeroes(onlyMyHeroes: boolean) {
  return (
    <div className="flex h-28 flex-col items-center justify-center">
      <div className="text-2xl font-bold">No heroes</div>
      <div className="mt-4 text-lg text-gray-500">
        {onlyMyHeroes
          ? "You don't have any heroes listed for sale"
          : "There are no listed heroes that match your filter"}
      </div>
    </div>
  )
}
