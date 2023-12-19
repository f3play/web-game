import { Address } from "wagmi"

export const HeroElements = [
  "maruko",
  "panda",
  "boy",
  "quby",
  "dogee",
  "shibafat",
  "tobee",
  "meowy",
  "sir",
] as const

export type HeroElement = (typeof HeroElements)[number]

export const HeroRarities = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const

export type HeroRarity = (typeof HeroRarities)[number]

export type Hero = {
  id: bigint
  name: string
  img: string
  element: HeroElement
  rarity: HeroRarity
  attack: number
  defense: number
  level: number
  baseRate: number
  hashRate: number
  bornAt: number
}

export const ParseRarity = (rarity: number): HeroRarity => {
  if (rarity <= HeroRarities.length) return HeroRarities[rarity - 1]
  return HeroRarities[0]
}

export const RarityToNumber = (rarity?: HeroRarity): number => {
  return rarity ? HeroRarities.indexOf(rarity) + 1 : 0
}

export const ParseElement = (type: number): HeroElement => {
  if (type <= HeroElements.length) return HeroElements[type - 1]
  return HeroElements[0]
}

export const ElementToNumber = (type?: HeroElement): number => {
  return type ? HeroElements.indexOf(type) + 1 : 0
}

export const canUpgrade = (hero: Hero): boolean => {
  return HeroRarities.indexOf(hero.rarity) >= HeroRarities.indexOf("epic")
}

export const getHeroImage = (element: string, rarity: string) => {
  return `/assets/characters/${element}-${rarity}.png`
}

export const heroFromAttributes = (id: bigint, attrs: any): Hero => {
  const hero = {
    id,
    name: `#${id.toString()}`,
    img: "",
    element: ParseElement(Number(attrs.element)),
    rarity: ParseRarity(Number(attrs.rarity)),
    attack: Number(attrs.attack),
    defense: Number(attrs.defense),
    level: Number(attrs.level),
    baseRate: Number(attrs.baseRate),
    hashRate: Number(attrs.hashRate),
    bornAt: Number(attrs.bornAt),
  }

  hero.img = getHeroImage(hero.element, hero.rarity)

  return hero
}

export type HeroListing = {
  nftIds: bigint[]
  id: bigint
  price: bigint
  seller: Address
}

export type HeroForSale = Hero & {
  listing?: HeroListing
}

export type HeroFilter = {
  element?: HeroElement
  rarity?: HeroRarity
}

const bonusHashRate = (level: number) => {
  if (level >= 20) {
    return 1000
  } else if (level >= 15) {
    return 750
  } else if (level >= 10) {
    return 500
  } else if (level >= 15) {
    return 250
  }

  return 0
}

export const newUpgradePower = (power: number, level: number) => {
  return (power * level * (10000 + bonusHashRate(level))) / 10000
}
