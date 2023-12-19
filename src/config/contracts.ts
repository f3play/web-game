import { Address } from "wagmi"
import { MarketplaceABI, PandaNFTABI, TournamentABI } from "./abis"
import PandaTokenABI from "./abis/PandaToken"
import PandaBoxABI from "@/config/abis/PandaBox"
import MultiviewABI from "@/config/abis/Multiview";
import F3CenterABI from "@/config/abis/F3Center";
import LotteryABI from "@/config/abis/Lottery";
import LotteryTokenABI from "@/config/abis/LotteryToken";
import ReferralABI from "@/config/abis/Referral";

export const MarketplaceAddress = process.env
  .NEXT_PUBLIC_MARKETPLACE_ADDRESS as Address

export const MarketplaceContract = {
  address: MarketplaceAddress,
  abi: MarketplaceABI,
}

export const PandaNFTAddress = process.env
  .NEXT_PUBLIC_PANDA_NFT_ADDRESS as Address

export const PandaNFTContract = {
  address: PandaNFTAddress,
  abi: PandaNFTABI,
}

export const PandaTokenAddress = process.env
  .NEXT_PUBLIC_PANDA_TOKEN_ADDRESS as Address

export const PandaTokenContract = {
  address: PandaTokenAddress,
  abi: PandaTokenABI,
}

export const BusdTokenAddress = process.env
  .NEXT_PUBLIC_BUSD_TOKEN_ADDRESS as Address

export const BusdTokenContract = {
  address: BusdTokenAddress,
  abi: PandaTokenABI,
}

export const TournamentAddress = process.env
  .NEXT_PUBLIC_TOURNAMENT_ADDRESS as Address

export const TournamentContract = {
  address: TournamentAddress,
  abi: TournamentABI,
}

export const PandaBoxAddress = process.env
  .NEXT_PUBLIC_PANDA_BOX_ADDRESS as Address

export const PandaBoxContract = {
  address: PandaBoxAddress,
  abi: PandaBoxABI,
}

export const MultiviewAddress = process.env
  .NEXT_PUBLIC_MULTIVIEW_ADDRESS as Address

export const MultiviewContract = {
  address: MultiviewAddress,
  abi: MultiviewABI
}

export const F3CenterAddress = process.env.NEXT_PUBLIC_CENTER_ADDRESS as Address

export const F3CenterContract = {
  address: F3CenterAddress,
  abi: F3CenterABI
}

export const LotteryAddress = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS as Address

export const LotteryContract = {
  address: LotteryAddress,
  abi: LotteryABI
}

export const LotteryTokenAddress = process.env.NEXT_PUBLIC_LOTTERY_TOKEN_ADDRESS

export const LotteryTokenContract = {
  address: LotteryTokenAddress,
  abi: LotteryTokenABI
}

export const ReferralAddress = process.env.NEXT_PUBLIC_REFERRAL_ADDRESS

export const ReferralContract = {
  address: ReferralAddress,
  abi: ReferralABI
}