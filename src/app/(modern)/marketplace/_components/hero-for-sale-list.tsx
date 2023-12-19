import { HeroForSale } from "@/models/hero"
import classNames from "classnames"
import NftGrid from "@/app/shared/nft-grid"
import { MKP_HERO_PER_PAGE } from "@/config"
import { Suspense } from "react"
import PageLoading from "@/app/shared/page-loading"

export default function HeroForSaleList({
  heroes,
  isLoading,
}: {
  heroes: HeroForSale[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: MKP_HERO_PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className="flex h-72 w-full animate-pulse flex-col items-center justify-center rounded-lg bg-gray-200"
          >
            <div className="mb-3 h-16 w-16 animate-pulse rounded-full bg-gray-300"></div>
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-gray-300"></div>
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <div
        className={classNames(
          "grid gap-5 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        )}
      >
        {heroes.map((hero: HeroForSale) => (
          <NftGrid
            key={hero.id.toString()}
            nft={hero}
            showActions={true}
            listing={hero.listing}
            detailLink={`/nfts/${hero.id}`}
            canTrade={true}
            className={"mx-auto h-72 w-52"}
          />
        ))}
      </div>
    </Suspense>
  )
}
