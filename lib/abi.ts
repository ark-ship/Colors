export const abi = [
  {
    type: "function",
    stateMutability: "payable",
    name: "mint",
    inputs: [
      {
        name: "quantity",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    stateMutability: "view",
    name: "totalSupply",
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },

  {
    type: "function",
    stateMutability: "view",
    name: "MAX_SUPPLY",
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },

  {
    type: "function",
    stateMutability: "view",
    name: "tokenURI",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        type: "string",
      },
    ],
  }
] as const;