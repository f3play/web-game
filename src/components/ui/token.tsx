import {BusdTokenAddress} from "@/config/contracts";
import {ZERO_ADDRESS} from "@/utils";
import {Bnb} from "@/components/icons/bnb";
import {Tusd} from "@/components/icons/tusd";
import Image from "next/image";

export default function Token({className} : {className: string}) {
  
  return (
    <>
      {BusdTokenAddress === ZERO_ADDRESS && 
        <Image 
          className={className}
          src={"/assets/Icon/tomo.png"}
          alt={"tomo-token"}
          width={15}
          height={15}
        /> ||
        <Image
          className={className}
          src={"/assets/Icon/usdt.svg"}
          alt={"busd-token"}
          width={15}
          height={15}
        />
      }
    </>
  )
}
