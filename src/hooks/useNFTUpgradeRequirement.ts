import { PandaNFTContract } from "@/config/contracts"
import { ethers } from "ethers"
import { useContractRead } from "wagmi"

export const useNFTUpgradeRequirement = (level: number, rarity: string) => {
  const { data, refetch } = useContractRead({
    ...PandaNFTContract,
    functionName: "requirementOfLevel",
    args: [level],
    enabled: !!level,
  })

  if (data?.length == 4 && rarity === "legendary") {
    data.push(data[3])
    data[3] = 0
  }

  return data
}

export const useNFTUpgradeCost = (level: number) => {
  const { data, refetch } = useContractRead({
    ...PandaNFTContract,
    functionName: "upgradeCost",
    args: [level],
    enabled: !!level,
  })

  return {
    data,
    refetch,
  }
}
