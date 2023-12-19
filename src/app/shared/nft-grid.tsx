import Image from "next/image"
import classNames from "classnames"
import { Poppins } from "next/font/google"
import Button from "@/components/ui/button"
import { getHeroImage, Hero, HeroListing } from "@/models/hero"
import { PAYMENT_TOKEN } from "@/config"
import { formatTokenAmount } from "@/utils/token"
import Link from "next/link"
import TradeButton from "@/components/sale/trade-button"
import { useAccount } from "wagmi"

const poppin_font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export default function NftGrid({
  nft,
  listing,
  className,
  showActions = true,
  canTrade = false,
  canUpgrade = false,
  detailLink,
  isMotion = true,
  showAttribute = true,
  nftListQuery = undefined,
}: {
  nft: Hero
  listing?: HeroListing
  className?: string
  showActions: boolean
  canTrade?: boolean
  canUpgrade?: boolean
  detailLink?: string
  isMotion?: boolean
  showAttribute?: boolean
  nftListQuery?: any
}) {
  const { address } = useAccount()

  const bg = `/assets/Icon/bg-${nft.rarity}.png`
  const heroImg = getHeroImage(nft.element, nft.rarity)

  return (
    <div
      className={classNames(
        "box group relative overflow-hidden rounded-lg transition-all duration-200",
        className ? className : "h-96",
      )}
    >
      <Image
        alt={"background"}
        className={"absolute w-full"}
        src={bg}
        fill={true}
        priority={true}
      />
      <div className={"w-full"}>
        <div
          className={classNames(
            "absolute top-1/2 mx-auto mb-[4px] block w-full -translate-y-1/2 transform",
            "hover:cursor-pointer",
          )}
          // onClick={() =>
          //   detailNavigate ? router.push("my-nfts/" + nftId) : ""
          // }
        >
          <Image
            src={heroImg}
            className={"mx-auto w-8/12"}
            width={180}
            height={450}
            alt=""
            priority={true}
          />
        </div>
        {showAttribute && (
          <div
            className={
              "absolute top-10 flex grid w-full grid-cols-12 items-center justify-between bg-transparent"
            }
          >
            <div className="col-span-2"></div>
            <div className="col-span-4">
              <div
                className={classNames(
                  "flex text-xs font-semibold text-white 2xl:h-5 ",
                  poppin_font.className,
                )}
              >
                <h3
                  className={classNames(
                    "text-xs font-semibold text-white 2xl:h-5",
                    "rounded-md bg-slate-700 p-1",
                    "text-[15px]",
                  )}
                >
                  <span>Lv </span>
                  {nft.level}
                </h3>
              </div>
            </div>

            <div className={"col-span-4 text-right subpixel-antialiased"}>
              #{Number(nft.id)}
            </div>
            <div className="col-span-2"></div>
          </div>
        )}
        <div className="absolute bottom-10 grid w-full gap-[8px] px-[8px] py-2 opacity-80">
          {showAttribute && (
            <div
              className={
                "w-12/12 mx-auto bg-gradient-to-r from-slate-400/10 via-slate-700 to-slate-400/10"
              }
            >
              <div className={"mx-auto flex w-fit items-center"}>
                <Image
                  className={"w-1.5/12"}
                  src={"/assets/Icon/attack.svg"}
                  alt={""}
                  width={20}
                  height={10}
                />
                <p>{nft.attack}</p>
                <Image
                  className={"w-1.5/12 ml-2"}
                  src={"/assets/Icon/defense.svg"}
                  alt={""}
                  width={20}
                  height={10}
                />
                <p>{nft.defense}</p>
              </div>
            </div>
          )}
          {listing && (
            <div
              className={
                "mx-auto w-[185px] bg-gradient-to-r from-slate-500/30 via-slate-900 to-slate-500/30 text-center"
              }
            >
              <span className="text-yellow-400">
                {formatTokenAmount(listing.price)}
              </span>{" "}
              {PAYMENT_TOKEN}
            </div>
          )}
        </div>
      </div>
      {showActions && (
        <div
          className={classNames(
            "invisible z-20 mx-auto h-full w-full duration-0 ease-in-out",
            showActions ? "group-hover:visible" : "",
          )}
        >
          <div
            className={
              "absolute mx-auto grid h-full w-full content-center gap-2 bg-slate-800/60"
            }
          >
            <div className={"mx-auto grid w-9/12 grid-cols-1 gap-y-3"}>
              {address && canTrade && (
                <TradeButton
                  user={address}
                  hero={nft}
                  listing={listing}
                  size="mini"
                  nftListQuery={nftListQuery}
                />
              )}
              {canUpgrade && (
                <Link href={`my-nfts/upgrade/${nft.id}`}>
                  <Button
                    className={"w-full uppercase"}
                    shape={"rounded"}
                    size={"mini"}
                  >
                    Upgrade
                  </Button>
                </Link>
              )}
              {detailLink && (
                <Link href={detailLink}>
                  <Button
                    shape={"rounded"}
                    size={"mini"}
                    color={"primary"}
                    className={"w-full uppercase"}
                  >
                    Detail
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
