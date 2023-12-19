import { useContractWrite, useWaitForTransaction } from "wagmi"

type TransactionExecutionError = Error & {
  shortMessage: string
}

export const useContractWriteAndWait = (data: any) => {
  // TODO: detect error from data

  const tx = useContractWrite(data.config)

  const resp = useWaitForTransaction({ hash: tx.data?.hash })

  return {
    ...resp,
    write: tx.write,
    isLoading: tx.isLoading || resp.isLoading,
    error: (tx.error || resp.error) as TransactionExecutionError,
    isError: tx.isError || resp.isError,
  }
}
