import { PandaNFTContract, TournamentAddress } from "@/config/contracts"
import { Address, useContractRead, useContractReads } from "wagmi"

export const useNFTIsApproveForAll = (owner: Address) => {
  const { data: isApproved } = useContractRead({
    ...PandaNFTContract,
    functionName: "isApprovedForAll",
    args: [owner, TournamentAddress],
    enabled: !!owner,
    watch: true,
  })

  return isApproved
}
