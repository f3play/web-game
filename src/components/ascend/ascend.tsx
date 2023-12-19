"use client"

import { useState } from "react"
import { NFT } from "@/models/nft"
import classNames from "classnames"
import Image from "next/image"
import { useQuery } from "react-query"
import { NFTS_YOUR_HERO } from "@/utils/constants"
import { GetAllNFTs } from "@/hooks/nfts"
import ChooseAscendDialog from "../../app/shared/choose-ascend-dialog"
import Button from "../ui/button"
import ChooseHeroesDialog from "../../app/shared/choose-heroes-dialog"
import NftGrid from "../my-nfts/nft-grid"

export function EmptyCard({}) {
  return (
    <div
      className={classNames(
        "relative grid h-[350px] w-full place-self-center overflow-hidden rounded-lg bg-white" +
          " shadow transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-large dark:bg-light-dark"
      )}
    >
      <Image
        className="block place-self-center"
        src={"/assets/Icon/plus.svg"}
        width={140}
        height={450}
        alt=""
      />
    </div>
  )
}

export function HeroAscendCard({ hero }: { hero: NFT | null }) {
  return (
    <>
      {(hero && (
        <NftGrid
          nft={hero}
          className={"hover:scale-105 hover:cursor-pointer"}
          detailNavigate={false}
        />
      )) || (
        <div
          className={classNames(
            "relative grid h-[350px] w-full place-self-center overflow-hidden rounded-lg bg-white" +
              " shadow transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-large dark:bg-light-dark"
          )}
        >
          <Image
            className="block place-self-center"
            src={"/assets/Icon/plus.svg"}
            width={140}
            height={450}
            alt=""
          />
        </div>
      )}
    </>
  )
}

export default function Ascend() {
  let [yourHeroes, setYourHeroes] = useState<NFT[]>([])
  let [ascendHero, setAscendHero] = useState<NFT>(null)
  let [pickAscend, setPickAscend] = useState(false)
  let [materials, setMaterials] = useState<NFT[]>([])
  let [pickMaterials, setPickMaterials] = useState(false)
  const heroesQuery = useQuery([NFTS_YOUR_HERO], () => GetAllNFTs, {
    onSuccess: (result) => {
      setYourHeroes(result)
    }
  })
  return (
    <div className="mx-auto my-5 flex w-8/12 flex-col gap-2 gap-y-5 rounded-lg">
      <h3 className={"mx-auto w-fit uppercase"}>Upgrade Hero</h3>
      <div
        className={
          "ascend-section scale-95 rounded-xl border-2 border-dashed border-gray-800 p-12"
        }
      >
        <div className={"mx-auto grid grid-cols-3 gap-5"}>
          <div
            onClick={() => {
              setPickAscend(true)
            }}
          >
            <HeroAscendCard hero={ascendHero} setOpenDialog={setPickAscend} />
          </div>
          <Button
            disabled={!ascendHero}
            className={"place-self-center disabled:text-gray-600/60"}
            shape={"rounded"}
            size={"large"}
            onClick={() => {}}
          >
            Upgrade
          </Button>
          <EmptyCard />
        </div>
      </div>
      <div
        className={
          "ascend-section scale-95 rounded-xl border-2 border-dashed border-gray-800 p-12"
        }
      >
        <div className={"mx-auto grid grid-cols-3 gap-5"}>
          <div
            onClick={() => {
              setPickMaterials(true)
            }}
          >
            <HeroAscendCard hero={materials[0]} />
          </div>
          <div
            onClick={() => {
              setPickMaterials(true)
            }}
          >
            <HeroAscendCard hero={materials[1]} />
          </div>
          <div
            onClick={() => {
              setPickMaterials(true)
            }}
          >
            <HeroAscendCard hero={materials[2]} />
          </div>
        </div>
      </div>
      <ChooseAscendDialog
        hero={ascendHero}
        setHero={setAscendHero}
        isOpen={pickAscend}
        setIsOpen={setPickAscend}
        listHeroes={yourHeroes}
      />
      <ChooseHeroesDialog
        listHeroes={yourHeroes}
        setLineUp={setMaterials}
        isOpen={pickMaterials}
        setIsOpen={setPickMaterials}
        lineUp={materials}
      />
    </div>
  )
}
