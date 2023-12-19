import { Address, useContractRead, useContractReads } from "wagmi"
import { heroFromAttributes } from "@/models/hero"
import { PandaNFTContract } from "@/config/contracts"

export const useMultiNFTAttribute = (ids: string[]) => {
  const calls = []
  for (let id of ids) {
    calls.push({
      ...PandaNFTContract,
      functionName: "attributes",
      args: [id],
      cacheTime: 3000,
    })
  }

  const { data: nftInfos } = useContractReads({ contracts: calls })

  const r = []
  for (let i = 0; i < ids.length; i++) {
    if (!nftInfos || nftInfos[i].status != "success") {
      continue
    }
    r.push(heroFromAttributes(BigInt(ids[i]), nftInfos[i].result))
  }

  return r
}

export const useNFTAttribute = (id: number) => {
  const { data, refetch, isLoading } = useContractRead({
    ...PandaNFTContract,
    functionName: "attributes",
    args: [BigInt(id)],
    cacheTime: 3000,
  })

  return {
    nft: data ? heroFromAttributes(BigInt(id), data) : {},
    refetch: refetch,
    isLoading,
  }
}

export const mapNFTAttributeOnchainData = (id: string, data: any) => {
  if (!data) {
    return {}
  }

  return heroFromAttributes(BigInt(id), data)
}

export function parseRarityToInt(value: string) {
  const rarityMap = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
  }

  return rarityMap[value]
}

export function useNFTUpgradePreview(
  account: Address,
  tokenId: bigint,
  materialNFTs: bigint[],
  enable: boolean,
) {
  const data = useContractRead({
    ...PandaNFTContract,
    functionName: "upgradePreview",
    args: [tokenId, materialNFTs],
    enabled: !!account && enable,
    account: account,
  })

  return {
    data: !data.data ? undefined : heroFromAttributes(tokenId, data.data),
    refetch: data.refetch,
  }
}
