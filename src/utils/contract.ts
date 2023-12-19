import { waitForTransaction, writeContract } from "@wagmi/core"

export const waitForContractWrite = async (
  ...config: Parameters<typeof writeContract>
): Promise<ReturnType<typeof waitForTransaction>> => {
  const tx = await writeContract(...config)
  return await waitForTransaction(tx)
}
