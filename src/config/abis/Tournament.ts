const TournamentABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "startTime_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "roundDuration_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "nft_",
        type: "address",
      },
      {
        internalType: "address",
        name: "poolReward_",
        type: "address",
      },
      {
        internalType: "address",
        name: "lotteryToken_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "BattleTooQuick",
    type: "error",
  },
  {
    inputs: [],
    name: "ContractNotAllowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_size",
        type: "uint256",
      },
    ],
    name: "InvalidSquadTeamSize",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_nftId",
        type: "uint256",
      },
    ],
    name: "MustBeOwnerOfNFT",
    type: "error",
  },
  {
    inputs: [],
    name: "MustMaintain1NFTWhenTournamentRunning",
    type: "error",
  },
  {
    inputs: [],
    name: "NoOpponent",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughPlayers",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RewardHasBeendFinallize",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RoundNotFinished",
    type: "error",
  },
  {
    inputs: [],
    name: "TournamentHasEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "TournamentNotFinished",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "attacker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "defender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "battleResult",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "attackerTScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "attackerRScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "defenderTScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "defenderDScore",
        type: "uint256",
      },
    ],
    name: "BattleResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Claimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOpponent",
        type: "address",
      },
    ],
    name: "OpponentChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "poolReward",
        type: "address",
      },
    ],
    name: "PoolRewardSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "nftIds",
        type: "uint256[]",
      },
    ],
    name: "SquadTeamUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "BATTLE_COST",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFENSE_TEAM_SIZE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FREE_BATTLE_PER_ROUND",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REROLL_OPPONENT_COST",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "battle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "battleCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
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
    name: "battleHistories",
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
            internalType: "uint256[]",
            name: "attackerSquad",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "defenderSquad",
            type: "uint256[]",
          },
        ],
        internalType: "struct ITournament.BattleHistory[]",
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
        name: "player_",
        type: "address",
      },
    ],
    name: "battleHistoryCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player_",
        type: "address",
      },
    ],
    name: "claimable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rank_",
        type: "uint256",
      },
    ],
    name: "getPercentRewardByRank",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player_",
        type: "address",
      },
    ],
    name: "opponent",
    outputs: [
      {
        internalType: "address",
        name: "opponentAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "squad",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "squad_",
        type: "uint256[]",
      },
    ],
    name: "pickSquad",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rankIndex",
        type: "uint256",
      },
    ],
    name: "playerInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "battleCount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "squad",
            type: "uint256[]",
          },
        ],
        internalType: "struct ITournament.PlayerRankInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundIndex_",
        type: "uint256",
      },
    ],
    name: "rankedFinalForRound",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rerollOpponent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundIndex_",
        type: "uint256",
      },
    ],
    name: "roundInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPlayers",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewards",
            type: "uint256",
          },
        ],
        internalType: "struct ITournament.RoundInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "roundRanks",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "battleCount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "squad",
            type: "uint256[]",
          },
        ],
        internalType: "struct ITournament.PlayerRankInfo[]",
        name: "playerList",
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
        name: "poolReward",
        type: "address",
      },
    ],
    name: "setPoolReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "randomGenerator",
        type: "address",
      },
    ],
    name: "setRandomGenerator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tournamentInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "poolReward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentRound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tournamentReward",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roundDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPlayers",
            type: "uint256",
          },
        ],
        internalType: "struct ITournament.TournamentInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "includeTour_",
        type: "bool",
      },
    ],
    name: "updateReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export default TournamentABI
