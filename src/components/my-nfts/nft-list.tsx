import { NFT } from "@/models/nft"
import { useGridSwitcher } from "@/lib/hooks/use-grid-switcher"
import classNames from "classnames"
import { canUpgrade, ParseElement, ParseRarity } from "@/models/hero"
import NftGrid from "@/app/shared/nft-grid"

export default function NftList({
  nfts,
  isLoading,
  className,
  nftListQuery = undefined,
}: {
  nfts: NFT[]
  isLoading: boolean
  className?: string
  nftListQuery: any
}) {
  const { isGridCompact } = useGridSwitcher()
  return (
    <div className={"mx-auto grid h-[75vh] gap-y-3 py-5"}>
      {(isLoading && (
        <div
          className={classNames(
            "grid gap-5 sm:grid-cols-3 md:grid-cols-5",
            isGridCompact
              ? "3xl:!grid-cols-5 4xl:!grid-cols-5"
              : "3xl:!grid-cols-5 4xl:!grid-cols-5",
          )}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={
                "grid h-80 w-56 animate-pulse grid-cols-1 place-self-center rounded-xl bg-slate-500"
              }
            >
              <div
                className={
                  "h-32 w-32 animate-pulse place-self-center rounded-full bg-slate-600"
                }
              />
              <div className="col-span-2 mx-auto h-8 w-6/12 rounded-2xl bg-slate-700"></div>
            </div>
          ))}
        </div>
      )) || (
        <div
          className={classNames(
            "grid gap-5 sm:grid-cols-3 md:grid-cols-5",
            isGridCompact
              ? "3xl:!grid-cols-5 4xl:!grid-cols-5"
              : "3xl:!grid-cols-5 4xl:!grid-cols-5",
          )}
        >
          {nfts &&
            nfts.map((nftInfo: any, idx) => {
              if (!nftInfo || !nftInfo.id) return null
              const nft = {
                id: nftInfo.id,
                ...nftInfo.attribute,
                rarity: ParseRarity(nftInfo.attribute.rarity),
                element: ParseElement(nftInfo.attribute.element),
              }
              return (
                nftInfo && (
                  <NftGrid
                    key={idx}
                    nft={nft}
                    showActions={true}
                    canTrade={true}
                    canUpgrade={canUpgrade(nft)}
                    detailLink={`/nfts/${nft.id}`}
                    className={"mx-auto h-80 w-56"}
                    nftListQuery={nftListQuery}
                  />
                )
              )
            })}
        </div>
      )}
    </div>
  )
}
