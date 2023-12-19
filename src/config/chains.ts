const TomoChainTestnet = {
  id: 89,
  network: 'tomo',
  name: 'TomoChain Testnet',
  nativeCurrency: {
    name: 'TOMO',
    symbol: 'TOMO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.tomochain.com'],
    },
    public: {
      http: ['https://rpc.testnet.tomochain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'TomoChain Testnet',
      url: 'https://testnet.tomoscan.io',
    },
  },
  testnet: true,
};

const TomoChain = {
  id: 88,
  network: 'tomo',
  name: 'TomoChain Mainnet',
  nativeCurrency: {
    name: 'TOMO',
    symbol: 'TOMO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://tomo.blockpi.network/v1/rpc/public'],
    },
    public: {
      http: ['https://tomo.blockpi.network/v1/rpc/public'],
    },
  },
  blockExplorers: {
    default: {
      name: 'TomoChain Mainnet',
      url: 'https://tomoscan.io',
    },
  },
  testnet: false,
};

export { TomoChainTestnet, TomoChain };
