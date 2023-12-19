import {CHAIN_SCAN_URL, CHAIN_TX_URL, startAndEnd} from "@/utils";
import classNames from "classnames";

export default function TxHyperLink({txHash}: {txHash: string}) {
  return (
    <a href={CHAIN_TX_URL + txHash} target={"#"} className={classNames(
      'text-xs normal-case text-blue-600 dark:text-sky-400 underline',
      "underline-offset-2"
    )}>Detail Transaction</a>
  )
}

export function AddressHyperLink({address} : {address: string}) {
  return (
    <a
      href={CHAIN_SCAN_URL + address}
      target={"#"}
      className={classNames(
        "normal-case text-blue-600 underline dark:text-sky-400",
        "underline-offset-2",
      )}
    >
      {startAndEnd(address)}
    </a>
  )
}