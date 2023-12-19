import { useContractRead } from "wagmi"
import { Box } from "@/models/box"
import pandaBoxABI from "@/utils/panda-box.json"
import {History} from "@/models/history";
import {ADDRESS_0} from "@/utils/tournament";

let boxes: Box[] = [
  {
    uid: 1,
    img: "/assets/box/box-1.png",
    name: "Pack 1",
    price: 2,
  },
  {
    uid: 2,
    img: "/assets/box/box-2.png",
    name: "Pack 5",
    price: 10,
  },
  {
    uid: 3,
    img: "/assets/box/box-1.png",
    name: "Pack 1",
    price: 2,
  },
  {
    uid: 5,
    img: "/assets/box/box-2.png",
    name: "Pack 5",
    price: 10,
  },
]

export function GetBoxes() {
  return boxes
}

const ContractConfig = {
  address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
  abi: pandaBoxABI,
}

export function GetBoxesTest() {
  const { data, isError, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
    abi: pandaBoxABI,
    functionName: "owner",
    args: {
      value: 1000000,
    },
  })

  return data
}

export function GetBoxPrice() {
  const { data, isError, isLoading, error } = useContractRead({
    abi: pandaBoxABI,
    address: process.env.NEXT_PUBLIC_PANDA_BOX_ADDRESS || ADDRESS_0,
    functionName: "BOX_PRICE",
  })

  if (isError) {
    console.error("failed to get box price", error)
  }

  return data
}

export function GetHistory(): History[] {
  return [
    {
      address: "0x2DCa240F3f9f2cd577715b9917613bA707f09b83",
      amount: 10,
      reward: 10,
      result: [
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "uncommon",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "rare",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "epic",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "legendary",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
      ],
      time: '2023-07-29 14:40:23'
    },
    {
      address: "0x2DCa240F3f9f2cd577715b9917613bA707f09b83",
      amount: 5,
      reward: 10,
      result: [
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "uncommon",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "rare",
          type: "panda",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "epic",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "legendary",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
      ],
      time: '2023-07-29 14:40:23'
    },
    {
      address: "0x2DCa240F3f9f2cd577715b9917613bA707f09b83",
      amount: 5,
      reward: 10,
      result: [
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "uncommon",
          type: "dogee",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "rare",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "epic",
          type: "quby",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "legendary",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
      ],
      time: '2023-07-29 14:40:23'
    },
    {
      address: "0x2DCa240F3f9f2cd577715b9917613bA707f09b83",
      amount: 5,
      reward: 10,
      result: [
        {
          rarity: "common",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "uncommon",
          type: "boy",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "rare",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "epic",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
        {
          rarity: "legendary",
          type: "maruko",
          attack: 10,
          defense: 10,
          level: 1,
        },
      ],
      time: '2023-07-29 14:40:23'
    },
  ]
}
