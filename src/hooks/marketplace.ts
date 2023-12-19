import { MarketplaceContract } from "@/config/contracts"
import { HeroListing, HeroForSale } from "@/models/hero"
import { useState, useEffect } from "react"
import { useContractRead, usePrepareContractWrite } from "wagmi"
import { useHero } from "./hero"
import { useContractWriteAndWait } from "."

export const useHeroListing = (id: bigint) => {
  const [listing, setListing] = useState<HeroListing | undefined>()

  const { data, isLoading } = useContractRead({
    ...MarketplaceContract,
    functionName: "listingByNftId",
    args: [id],
  })

  useEffect(() => {
    if (!data || !data[0]) return setListing(undefined)

    setListing({
      seller: data[1].seller,
      nftIds: [...data[1].nftIds],
      price: data[1].price,
      id: data[1].id,
    })
  }, [data])

  return { listing, isLoading }
}

export const useHeroForSale = (id: bigint) => {
  const [heroForSale, setHeroForSale] = useState<HeroForSale | null>(null)

  const { listing, isLoading: isLoadingListing } = useHeroListing(id)
  const { hero, isLoading: isLoadingInfo } = useHero(id)

  useEffect(() => {
    if (!listing || !hero) return setHeroForSale(null)

    setHeroForSale({
      ...hero,
      listing,
    })
  }, [listing, hero])

  return { hero: heroForSale, isLoading: isLoadingListing || isLoadingInfo }
}

export const useHeroBuy = (id: bigint, approved: boolean) => {
  const res = usePrepareContractWrite({
    ...MarketplaceContract,
    functionName: "buy",
    args: [id],
    enabled: approved,
  })

  return useContractWriteAndWait(res)
}

export const useHeroSell = (id: bigint, price: bigint) => {
  const res = usePrepareContractWrite({
    ...MarketplaceContract,
    functionName: "list",
    args: [[id], price],
    enabled: price > BigInt(0),
  })

  return useContractWriteAndWait(res)
}

export const useHeroUnlist = (id: bigint) => {
  const res = usePrepareContractWrite({
    ...MarketplaceContract,
    functionName: "unlist",
    args: [id],
  })

  return useContractWriteAndWait(res)
}
