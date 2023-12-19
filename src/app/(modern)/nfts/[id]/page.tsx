"use client"

import { useParams } from "next/navigation"
import { useHeroListing } from "@/hooks/marketplace"
import { useHero } from "@/hooks/hero"
import HeroDetail from "@/components/hero/hero-detail"

export default function Page() {
  const params = useParams()
  const nftId = BigInt(params.id as string)
  const { hero, isLoading: isHeroLoading } = useHero(nftId)
  const { listing, isLoading: isListingLoading } = useHeroListing(nftId)

  if (isHeroLoading || isListingLoading) {
    return <div>Loading...</div>
  }

  if (!hero) {
    return <div>Hero does not exist!</div>
  }

  return <HeroDetail hero={hero} listing={listing} />
}
