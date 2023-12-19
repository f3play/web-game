'use client'
import Image from 'next/image'
import {useState} from 'react'
import {Opponent} from '@/models/opponent'
import {useQuery} from 'react-query'
import {NFTS_OPPONENT, NFTS_YOUR_LINE_UP} from '@/utils/constants'
import {NFT} from '@/models/nft'
import HeroCard from '@/components/Base/NFTs/HeroCard'
import NftGrid from "@/components/my-nfts/nft-grid";

export function getOpponent(): Opponent {
  return {
    id: 2,
    address: '0x123...123',
    ranking: 1,
    point: 456,
    squad: [
      {
        id: 1,
        name: 'Pandaslayer',
        img: '/assets/characters-demo/warrior-1.png',
        attack: 100,
        defend: 100,
        hp: 100,
        type: 'water',
        rarity: 'common',
        level: 100,
      },
      {
        id: 2,
        name: 'Pandaslayer',
        img: '/assets/characters-demo/warrior-10.png',
        attack: 100,
        defend: 100,
        hp: 100,
        type: 'fire',
        rarity: 'uncommon',
        level: 100,
      },
      {
        id: 3,
        name: 'Pandaslayer',
        img: '/assets/characters-demo/warrior-11.png',
        attack: 100,
        defend: 100,
        hp: 100,
        type: 'light',
        rarity: 'rare',
        level: 100,
      },
      {
        id: 4,
        name: 'Pandaslayer',
        img: '/assets/characters-demo/warrior-12.png',
        attack: 100,
        defend: 100,
        hp: 100,
        type: 'fire',
        rarity: 'epic',
        level: 100,
      },
      {
        id: 5,
        name: 'Pandaslayer',
        img: '/assets/characters-demo/warrior-14.png',
        attack: 100,
        defend: 100,
        hp: 100,
        type: 'water',
        rarity: 'unique',
        level: 100,
      },
    ],
    win_rate: 10,
    point_earn: 10,
  }
}

export function getLineUp(): NFT[] {
  return [{
    id: 1,
    name: 'Pandaslayer',
    img: '/assets/characters-demo/warrior-1.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'water',
    rarity: 'common',
    level: 100,
  },
    {
      id: 2,
      name: 'Pandaslayer',
      img: '/assets/characters-demo/warrior-10.png',
      attack: 100,
      defend: 100,
      hp: 100,
      type: 'fire',
      rarity: 'uncommon',
      level: 100,
    },
    {
      id: 3,
      name: 'Pandaslayer',
      img: '/assets/characters-demo/warrior-11.png',
      attack: 100,
      defend: 100,
      hp: 100,
      type: 'light',
      rarity: 'rare',
      level: 100,
    },
    {
      id: 4,
      name: 'Pandaslayer',
      img: '/assets/characters-demo/warrior-12.png',
      attack: 100,
      defend: 100,
      hp: 100,
      type: 'fire',
      rarity: 'epic',
      level: 100,
    },
    {
      id: 5,
      name: 'Pandaslayer',
      img: '/assets/characters-demo/warrior-14.png',
      attack: 100,
      defend: 100,
      hp: 100,
      type: 'water',
      rarity: 'unique',
      level: 100,
    },
  ]
}

export default function Fighting() {
  let [opponent, setOpponent] = useState<Opponent | null>(null)
  let [lineUp, setLineUp] = useState<NFT[]>([])
  let opponentQuery = useQuery({
    queryKey: [NFTS_OPPONENT],
    queryFn: () => getOpponent(),
    onSuccess: (result) => {
      setOpponent(result)
    },
  })

  let lineUpQuery = useQuery({
    queryKey: [NFTS_YOUR_LINE_UP],
    queryFn: () => getLineUp(),
    onSuccess: (result) => {
      setLineUp(result)
    },
  })

  if (!opponent) {
    return (
      <></>
    )
  }
  return (
    <>
      <div className={'w-full flex p-3 relative'}>
        <div className={'w-full bg-text-600/10 mx-auto rounded-xl absolute top-1/2'}>
          <div className={'meme-arena p-3 pb-7 rounded mx-auto mt-7'}>
            <div className={'opponent'}>
              <div className={'mx-auto w-8/12 opponent-squad'}>
                <div className={'grid grid-cols-5 justify-center gap-5'}>
                  {opponent.squad.map((nft, idx) => {
                    return (
                      <div className={'scale-75'} key={idx}>
                        <NftGrid nft={nft} className={""} detailNavigate={false}/>
                      </div>
                    )
                  })}
                </div>
                <div className={'w-full'}>
                  <p className={'text-right'}>Battle point: 100</p>
                </div>
              </div>
              <div className={"my-8"}>
                <Image className={'w-[75px] mx-auto hover:scale-105'} src={'/assets/Icon/battle.svg'} alt={''}
                       width={750}
                       height={750}/>
              </div>
              <div className={'grid grid-cols-12 w-full'}>
                <div className={'col-span-2 w-full'}></div>
                <div className={'your-squad mx-auto col-span-8'}>
                  <p>Battle point: {lineUp.reduce((acc, item) => acc + item.attack, 0)}</p>
                  <div className={'w-full grid grid-cols-5 justify-between gap-5 mx-auto'}>
                    {lineUp.map((nft) => {
                      return (
                        <div className={'scale-75'} key={nft.id}>
                          <NftGrid nft={nft} className={""} detailNavigate={false}/>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className={'col-span-2 w-full'}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}