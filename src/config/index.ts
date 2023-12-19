import { ethers } from "ethers"
import {BusdTokenAddress} from "@/config/contracts";
import {ZERO_ADDRESS} from "@/utils";

// TODO: fetch from contract
export const ERC20_SYMBOL = "USDT"

export const NATIVE_SYMBOL = "TOMO"

export const PAYMENT_TOKEN = BusdTokenAddress === ZERO_ADDRESS ? NATIVE_SYMBOL : ERC20_SYMBOL

export const ERC20_DISPLAY_DECIMALS = 4

export const DEFAULT_APPROVAL_TOKEN_AMOUNT = ethers.parseEther("1000000")

export const MKP_HERO_PER_PAGE = 12
export const MKP_TRADE_PER_PAGE = 20
