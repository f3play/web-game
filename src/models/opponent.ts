import { NFT } from "@/models/nft"
import { ADDRESS_0 } from "@/utils/tournament"

export type Opponent = {
  address: string
  squad: number[]
}

export const opponentFromData = (data: any): Opponent => {
  if (!data) return { address: ADDRESS_0, squad: [] }

  const model = {
    address: data[0] || ADDRESS_0,
    squad: data[1] || [],
  }

  return model
}
