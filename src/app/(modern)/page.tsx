"use client"
import Tournament from "@/components/battle/tournament"
import { useSearchParams } from "next/navigation"
import { ethers } from "ethers"

export default function IndexPageModern() {
  const searchParams = useSearchParams()
  let referral = localStorage.getItem("referralAddress")
  if (!ethers.isAddress(referral)) {
    referral = searchParams.get("referral")
    if (ethers.isAddress(referral)) {
      localStorage.setItem("referralAddress", referral)
    }
  }
  return <Tournament />
}
