import {useContractRead, usePrepareContractWrite, useSendTransaction} from "wagmi";
import pandaBoxABI from "@/utils/panda-box.json";
import {ADDRESS_0} from "@/utils/tournament";


// export function BoxPrice() {
//   const
//
// }

export function OpenBox() {

}

export function BuyBox() {
  const boxPrice = BoxPrice()
  const {data, isError, isLoading, error} = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
    abi: pandaBoxABI,
    functionName: 'buyBox',
    value: 1100
  })

  if (isError) {
    console.error("failed to buy box", error)
  }
  return data
}

 function BoxPrice() {
  const {data, isError, isLoading, error} = useContractRead({
    address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
    abi: pandaBoxABI,
    functionName: 'BOX_PRICE'
  })
  if (isError) {
    console.error("failed to get box price")
  }
  
  return data
}