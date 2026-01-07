// Auxidien Contract Addresses (BSC Mainnet)
export const CONTRACTS = {
  AUXI_TOKEN: '0x03e5FD0dfc9755f070BA420Ae364c452C1aFbd36',
  ORACLE: '0xFc124A410A4AD4c448911735BF0BCc44E8C74Fbd',
  VESTING: '0x48D15B999c0cD5f160D739974188193c59c13474',
} as const;

// Chain config
export const BSC_MAINNET = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed1.binance.org/'] },
    public: { http: ['https://bsc-dataseed1.binance.org/'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
} as const;

// Token info
export const TOKEN_INFO = {
  name: 'Auxidien Index Token',
  symbol: 'AUXI',
  decimals: 18,
  totalSupply: 100_000_000,
  description: 'Volume-weighted precious metals index token',
};

// Tokenomics
export const TOKENOMICS = {
  team: { amount: 15_000_000, percentage: 15, label: 'Team & Development' },
  treasury: { amount: 20_000_000, percentage: 20, label: 'Treasury' },
  liquidity: { amount: 20_000_000, percentage: 20, label: 'Liquidity' },
  public: { amount: 35_000_000, percentage: 35, label: 'Public Distribution' },
  advisors: { amount: 10_000_000, percentage: 10, label: 'Strategic & Advisors' },
};

// Metal info
export const METALS = {
  XAU: { name: 'Gold', symbol: 'XAU', color: '#FFD700', icon: '🥇' },
  XAG: { name: 'Silver', symbol: 'XAG', color: '#C0C0C0', icon: '🥈' },
  XPT: { name: 'Platinum', symbol: 'XPT', color: '#E5E4E2', icon: '⚪' },
  XPD: { name: 'Palladium', symbol: 'XPD', color: '#CED0CE', icon: '🔘' },
};

// Oracle ABI (minimal for reading)
export const ORACLE_ABI = [
  {
    inputs: [],
    name: 'getPricePerOzE6',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastUpdateAt',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'goldPrice',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'silverPrice',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platinumPrice',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'palladiumPrice',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Token ABI (minimal for reading)
export const TOKEN_ABI = [
  {
    inputs: [{ type: 'address', name: 'account' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Vesting ABI (minimal)
export const VESTING_ABI = [
  {
    inputs: [{ type: 'uint256', name: 'index' }],
    name: 'getSchedule',
    outputs: [
      { type: 'address', name: 'beneficiary' },
      { type: 'uint256', name: 'totalAmount' },
      { type: 'uint256', name: 'releasedAmount' },
      { type: 'uint256', name: 'startTime' },
      { type: 'uint256', name: 'cliffTime' },
      { type: 'uint256', name: 'endTime' },
      { type: 'bool', name: 'revocable' },
      { type: 'bool', name: 'revoked' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'schedulesCount',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
