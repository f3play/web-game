import { ethers } from "ethers"

/**
 * Function to format ERC20 token amount.
 *
 * @param rawAmount - The raw token amount from the blockchain (in Wei).
 * @param decimals - The number of decimal places of the token.
 * @returns - The token amount formatted with decimals.
 */
export function formatTokenAmount(
  rawAmount: bigint,
  decimals: number = 18,
): string {
  // Convert the raw amount from Wei to Ether (or equivalent for token)
  const formattedAmount = ethers.formatUnits(rawAmount, decimals)

  return formattedAmount
}
