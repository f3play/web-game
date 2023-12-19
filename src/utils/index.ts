import Decimal from "decimal.js"
import {TomoChain, TomoChainTestnet} from "@/config/chains";

export function startAndEnd(str: string, start: number = 6, end: number = 4) {
  // if (str.length > 35) {
  return str.substr(0, start) + "..." + str.substr(str.length - end, str.length)
  // }
}

export function formatDecimalString(decimalString: string, decimals = 3) {
  const decimalValue = new Decimal(decimalString)
  const formattedValue = decimalValue.toFixed(20) // Use a higher precision
  const decimalIndex = formattedValue.indexOf(".")
  if (decimalIndex !== -1) {
    return formattedValue.slice(0, decimalIndex + decimals) // Include two decimal places
  }
  return formattedValue
}

export const CHAIN_SCAN = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'https://tomoscan.io/' : 'https://testnet.tomoscan.io/'

export const CHAIN_SCAN_URL = CHAIN_SCAN + "address/"
export const CHAIN_TX_URL = CHAIN_SCAN + "txs/"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const ListTournaments = [
]

export const Networks = {
  'testnet': {
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x59",
        rpcUrls: ["https://rpc.testnet.tomochain.com"],
        chainName: "TomoChain Testnet",
        nativeCurrency: {
          name: "TOMO",
          symbol: "TOMO",
          decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.tomoscan.io"],
      },
    ],
  },
  'mainnet': {
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x58",
        rpcUrls: ["https://tomo.blockpi.network/v1/rpc/public"],
        chainName: "TomoChain Mainnet",
        nativeCurrency: {
          name: "TOMO",
          symbol: "TOMO",
          decimals: 18,
        },
        blockExplorerUrls: ["https://tomoscan.io"],
      },
    ],
  }
}

export const AttributeMapping = {
  element: 0,
  rarity: 1,
  attack: 2,
  defense: 3,
  level: 4,
  baseRate: 5,
  hashRate: 6,
  bornAt: 7,
}

export function GetChainID() {
    return (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') ? TomoChain.id : TomoChainTestnet.id
}
