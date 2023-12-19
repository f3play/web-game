import { useQuery } from 'react-query'
import { NFTS_QUERY_KEY } from '@/utils/constants'
import { NFT } from '@/models/nft'

const nfts: NFT[] = [
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
  {
    id: 6,
    name: 'Pandafury',
    img: '/assets/characters-demo/warrior-2.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'shadow',
    rarity: 'common',
    level: 100,
  },
  {
    id: 7,
    name: 'Warriorclaw',
    img: '/assets/characters-demo/warrior-3.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'water',
    rarity: 'epic',
    level: 100,
  },
  {
    id: 8,
    name: 'Pandashield',
    img: '/assets/characters-demo/warrior-4.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'light',
    rarity: 'rare',
    level: 100,
  },
  {
    id: 9,
    name: 'Pandamancer',
    img: '/assets/characters-demo/shaman-4.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'shadow',
    rarity: 'unique',
    level: 100,
  },
  {
    id: 10,
    name: 'Shamoo',
    img: '/assets/characters-demo/shaman-1.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'grass',
    rarity: 'rare',
    level: 100,
  },
  {
    id: 11,
    name: 'Whisperer',
    img: '/assets/characters-demo/shaman-2.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'water',
    rarity: 'uncommon',
    level: 100,
  },
  {
    id: 12,
    name: 'Pandatotem',
    img: '/assets/characters-demo/shaman-3.png',
    attack: 100,
    defend: 100,
    hp: 100,
    type: 'grass',
    rarity: 'epic',
    level: 100,
  },
]

export function ListNFTs(rarity: string, type: string) {
  return useQuery({
    queryKey: [NFTS_QUERY_KEY],
    queryFn: () => GetNFTs(rarity, type),
  })
}

export function GetAllNFTs() {
  return nfts
}

export function GetNFTs(rarity: string, type: string): NFT[] {
  return nfts.filter((nft) => {
    if (!rarity && !type) {
      return true
    }

    const isRareMatch = !rarity || nft.rarity === rarity
    const isTypeMatch = !type || nft.type === type

    return isRareMatch && isTypeMatch
  })
}

export function NFTDetail(id: number): NFT | null {
  const result = nfts.filter((nft) => nft.id === id)
  if (result.length === 0) {
    return null
  }
  return result[0]
}

