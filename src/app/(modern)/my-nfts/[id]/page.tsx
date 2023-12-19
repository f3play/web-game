"use client"

import HeroDetail from "@/components/hero/hero-detail"
import { useHero } from "@/hooks/hero"
import { useParams } from "next/navigation"

export default function NFTDetail() {
  const params = useParams()
  const nftId = BigInt(params.id as string)
  const { hero, isLoading: isHeroLoading } = useHero(nftId)

  if (isHeroLoading) {
    return <div>Loading...</div>
  }

  if (!hero) {
    return <div>Hero does not existed</div>
  }

  return <HeroDetail hero={hero} />
}
