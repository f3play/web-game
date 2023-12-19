import dayjs from "dayjs"
import { ethers } from "ethers"

export const shortAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4)
}

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatBattleTime = (second: number) => {
  return dayjs(second * 1000).format("YYYY-MM-DD HH:mm:ss")
}

export const formatTokenAmountString = (
  value: number,
  fractionDigits: number = 1,
) => {
  let amount = ethers.formatEther(value)
  return parseFloat(amount) == 0 ? "0" : Number(amount).toFixed(fractionDigits)
}

export const formatTimeNumber = (number: number) => {
  return number >= 100 ? number : ("0" + number).slice(-2)
}
