import { PandaNFTContract } from "@/config/contracts"
import { Hero, heroFromAttributes } from "@/models/hero"
import { useContractWriteAndWait } from "./index"
import { useState, useEffect } from "react"
import {
  Address,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
} from "wagmi"

export const useHero = (id: bigint) => {
  const [hero, setHero] = useState<Hero | undefined>(undefined)

  const { data, isLoading, error } = useContractRead({
    ...PandaNFTContract,
    functionName: "attributes",
    args: [id],
    scopeKey: `attributes-${id}`,
  })

  useEffect(() => {
    if (!data) return setHero(undefined)
    setHero(heroFromAttributes(id, data as unknown as bigint[]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    hero,
    isLoading,
    error,
  }
}

export const useHeroes = (ids: bigint[]) => {
  const [heroes, setHeroes] = useState<Hero[]>([])

  const contracts = ids.map((id: bigint) => ({
    ...PandaNFTContract,
    functionName: "attributes",
    args: [id],
  }))

  const { data, isLoading, error } = useContractReads({
    contracts,
    scopeKey: `attributes-${ids.join("-")}`,
    enabled: ids.length > 0,
  })

  useEffect(() => {
    setHeroes(
      (data || []).map((row, idx: number) =>
        heroFromAttributes(ids[idx], row.result as bigint[]),
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    heroes,
    isLoading,
    error,
  }
}

export const useHeroIsApprovedForAll = (
  owner?: Address,
  operator?: Address,
) => {
  const { data, ...res } = useContractRead({
    ...PandaNFTContract,
    functionName: "isApprovedForAll",
    args: [owner!, operator!],
    enabled: !!owner && !!operator,
    scopeKey: `isApprovedForAll-${owner}-${operator}`,
  })

  return {
    isApprovedForAll: data as boolean,
    ...res,
  }
}

export const useHeroSetApprovalForAll = (
  operator: Address,
  isApproved: boolean,
) => {
  const res = usePrepareContractWrite({
    ...PandaNFTContract,
    functionName: "setApprovalForAll",
    args: [operator, isApproved],
  })

  return useContractWriteAndWait(res)
}
