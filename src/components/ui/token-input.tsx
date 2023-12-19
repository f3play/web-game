import { ethers, FixedNumber } from "ethers"
import { BusdTokenAddress } from "@/config/contracts"
import { ZERO_ADDRESS } from "@/utils"
import { useEffect, useState } from "react"

const decimalPattern = /^[0-9]+[.]?[0-9]*$/

const formatUnits = (value: string, decimals: number) => {
  if (value === "") {
    return "0.0"
  }
  return FixedNumber.fromString(value).toString()
}

export default function TokenInput({
  symbol,
  displayDecimals,
  value,
  onChange,
}: {
  symbol: string
  displayDecimals: number
  decimals?: number
  value: string
  onChange: (value: string) => void
}) {
  let [price, setPrice] = useState(0)

  useEffect(() => {
    async function getPrice() {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/tomochain`,
      )
      return response.json()
    }

    getPrice().then((res) => {
      setPrice(res?.market_data.current_price ? res?.market_data.current_price.usd : 0)
    })
  })

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    if (val === "" || val.match(decimalPattern)) {
      onChange(val)
    }
  }

  return (
    <div
      className="border-1 flex flex-1 flex-col rounded-lg border border-gray-600 bg-inherit text-right hover:border-gray-500">
      {(BusdTokenAddress !== ZERO_ADDRESS && (
        <>
          <input
            type="text"
            value={value}
            placeholder="0.0"
            inputMode="decimal"
            onChange={handleOnChange}
            className="w-full border-0 bg-inherit pb-0.5 text-right text-lg outline-none focus:ring-0"
          />
          <span className="font-xs px-3 pb-1 text-gray-400">
            = {formatUnits(value, displayDecimals)} {symbol}
          </span>
        </>
      )) || (
        <>
          <div className={"flex items-center px-3 pb-0.5"}>
            <input
              type="text"
              value={value}
              placeholder="0.0"
              inputMode="decimal"
              onChange={handleOnChange}
              className="w-full border-0 bg-inherit text-right text-lg outline-none focus:ring-0"
            />
            <p>TOMO</p>
          </div>
          <span className="font-xs px-3 pb-1 text-gray-400">
            = {price * value} USD
          </span>
        </>
      )}
    </div>
  )
}
