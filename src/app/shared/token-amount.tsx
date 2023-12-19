import { TokenConfig } from "@/config/tokens"
import { numberWithCommas } from "@/utils/strings"
import classNames from "classnames"
import Image from "next/image"
import {BusdTokenAddress} from "@/config/contracts";
import {ZERO_ADDRESS} from "@/utils";
import {Bnb} from "@/components/icons/bnb";

export default function TokenAmount({
  // TokenConfig
  tokenConfig,
  amount,
  className,
}: {
  tokenConfig: any
  amount: number
  className?: any
}) {
  return (
    <div className={classNames("flex h-[20px] cursor-pointer items-center", className)}>
      {(BusdTokenAddress === ZERO_ADDRESS && <Image className={'mr-1'} src={tokenConfig?.image} alt={"tomo-token"} width={20} height={20}/>) || (
        <Image
          src={tokenConfig?.image}
          alt={""}
          className="mr-[4px] h-[20px]"
          width={20}
          height={20}
        />
      )}
      <div className="self-center">{numberWithCommas(amount)}</div>
    </div>
  )
}
