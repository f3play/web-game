import * as constants from "constants"

const MultiviewABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tournamentAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "nft_",
        type: "address",
      },
      {
        internalType: "address",
        name: "player_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "battleHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "attacker",
            type: "address",
          },
          {
            internalType: "address",
            name: "defender",
            type: "address",
          },
          {
            internalType: "bool",
            name: "result",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "attackerScoreChange",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "defenderScoreChange",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "playedAt",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint8",
                    name: "element",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "rarity",
                    type: "uint8",
                  },
                  {
                    internalType: "uint16",
                    name: "baseRate",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseAttack",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseDefense",
                    type: "uint16",
                  },
                  {
                    internalType: "uint32",
                    name: "attack",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "defense",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "level",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "hashRate",
                    type: "uint32",
                  },
                  {
                    internalType: "uint256",
                    name: "bornAt",
                    type: "uint256",
                  },
                ],
                internalType: "struct IF3NFT.Attribute",
                name: "attribute",
                type: "tuple",
              },
            ],
            internalType: "struct IF3MultiView.NFTView[]",
            name: "attackerSquad",
            type: "tuple[]",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint8",
                    name: "element",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "rarity",
                    type: "uint8",
                  },
                  {
                    internalType: "uint16",
                    name: "baseRate",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseAttack",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseDefense",
                    type: "uint16",
                  },
                  {
                    internalType: "uint32",
                    name: "attack",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "defense",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "level",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "hashRate",
                    type: "uint32",
                  },
                  {
                    internalType: "uint256",
                    name: "bornAt",
                    type: "uint256",
                  },
                ],
                internalType: "struct IF3NFT.Attribute",
                name: "attribute",
                type: "tuple",
              },
            ],
            internalType: "struct IF3MultiView.NFTView[]",
            name: "defenderSquad",
            type: "tuple[]",
          },
        ],
        internalType: "struct IF3MultiView.BattleHistoryView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "nfts",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint8",
                name: "element",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "rarity",
                type: "uint8",
              },
              {
                internalType: "uint16",
                name: "baseRate",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "baseAttack",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "baseDefense",
                type: "uint16",
              },
              {
                internalType: "uint32",
                name: "attack",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "defense",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "level",
                type: "uint32",
              },
              {
                internalType: "uint32",
                name: "hashRate",
                type: "uint32",
              },
              {
                internalType: "uint256",
                name: "bornAt",
                type: "uint256",
              },
            ],
            internalType: "struct IF3NFT.Attribute",
            name: "attribute",
            type: "tuple",
          },
        ],
        internalType: "struct IF3MultiView.NFTView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "boxAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "nft_",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "openBoxHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint8",
                    name: "element",
                    type: "uint8",
                  },
                  {
                    internalType: "uint8",
                    name: "rarity",
                    type: "uint8",
                  },
                  {
                    internalType: "uint16",
                    name: "baseRate",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseAttack",
                    type: "uint16",
                  },
                  {
                    internalType: "uint16",
                    name: "baseDefense",
                    type: "uint16",
                  },
                  {
                    internalType: "uint32",
                    name: "attack",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "defense",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "level",
                    type: "uint32",
                  },
                  {
                    internalType: "uint32",
                    name: "hashRate",
                    type: "uint32",
                  },
                  {
                    internalType: "uint256",
                    name: "bornAt",
                    type: "uint256",
                  },
                ],
                internalType: "struct IF3NFT.Attribute",
                name: "attribute",
                type: "tuple",
              },
            ],
            internalType: "struct IF3MultiView.NFTView[]",
            name: "nfts",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "tokenAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "openedAt",
            type: "uint256",
          },
        ],
        internalType: "struct IF3MultiView.OpenBoxHistoryView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export default MultiviewABI
