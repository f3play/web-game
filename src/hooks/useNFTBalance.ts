import { Address, useContractRead, useContractReads } from "wagmi"
import {
  MultiviewContract,
  PandaNFTAddress,
  PandaNFTContract,
} from "@/config/contracts"
import { heroFromAttributes } from "@/models/hero"

export const useNFTBalance = (account: Address) => {
  const { data: balance, refetch } = useContractRead({
    ...PandaNFTContract,
    functionName: "balanceOf",
    args: [account],
    enabled: !!account,
  })

  return {
    data: !balance ? 0 : parseInt(balance.toString()),
    refetch,
  }
}

export const useNFTTokenOfOwnerByIndex = (address: string, index: number) => {
  const { data: tokenId } = useContractRead({
    ...PandaNFTContract,
    functionName: "balanceOf",
    args: [address, index],
  })

  return tokenId
}

export function useNFTListTokenIdsOwned(account: Address, balance: number) {
  const calls = []

  for (let idx = 0; idx < balance; idx++) {
    calls.push({
      ...PandaNFTContract,
      functionName: "tokenOfOwnerByIndex",
      args: [account, idx],
    })
  }

  let { data: tokenIds, refetch } = useContractReads({ contracts: calls })

  // TODO: need check
  tokenIds = tokenIds?.filter((i) => i.status == "success")

  return {
    tokenIds: tokenIds?.map((i) => i.result.toString()) || [],
    refetch,
  }
}

export function useListNftMultiview(
  account: Address,
  offset: number,
  limit: number,
) {
  const { data } = useContractRead({
    ...MultiviewContract,
    functionName: "nfts",
    args: [PandaNFTAddress, account, BigInt(offset), BigInt(limit)],
  })

  return data
}

export function useListAllNFT(account: Address) {
  const { data: balance } = useNFTBalance(account)
  let limit = 50

  const calls = []
  for (let i = 0; i < balance; i = i + limit) {
    calls.push({
      ...MultiviewContract,
      functionName: "nfts",
      args: [PandaNFTAddress, account, i, limit],
    })
  }

  const { data: nftInfosData, refetch: refetchList } = useContractReads({
    contracts: calls,
  })

  const nftInfos =
    nftInfosData?.reduce((a, b) => {
      let newHeros = b.result?.map((item) =>
        heroFromAttributes(item.id, item.attribute),
      )
      a?.push(...newHeros)
      return a
    }, []) || []

  return {
    data: nftInfos,
    refetch: refetchList,
  }
}
