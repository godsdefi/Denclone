## Smart Contract Integration Guide

This document explains how to integrate the deployed smart contract (mainnet) into this frontend repo and how to wire up arbitrage monitoring and execution.

1) Get the ABI
  - Open the Etherscan page for the contract: https://etherscan.io/address/0x25B0a1cBf8C2cC862Fa8368102c1C53c4d05d864#code
  - Copy the `Contract ABI` JSON and paste it into `contracts/DenExecutor.abi.ts` replacing the empty array.

2) Configure RPC and contract address
  - Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_ETHEREUM_RPC` with your Alchemy/Infura/QuickNode mainnet RPC URL.
  - The contract address is already set in the example to the one you provided. If you use a different contract, update `NEXT_PUBLIC_DEN_CONTRACT_ADDRESS`.

3) Install dependencies
  - This project uses `pnpm`. Install dependencies:

```bash
pnpm install
```

4) Run the app

```bash
pnpm dev
```

5) How monitoring works (what to implement)
  - `lib/arbitrage.ts` contains `ArbitrageWatcher` which listens for new blocks and calls `scanForOpportunities`.
  - Implement `scanForOpportunities` to:
    - Query DEX quote contracts (Uniswap V3 Quoter, Sushi router, Curve) for expected output for candidate swaps.
    - Estimate gas and fees and compute net profit in ETH/USD.
    - If profit exceeds threshold, return an Opportunity object ({ profitUsd, profitWei, path }).

6) How execution works
  - `components/opportunity-executor.tsx` shows the last opportunity and allows you to connect a wallet and call the contract.
  - `lib/contract.ts` provides `executeOnChain(ethereum, methodName, args, opts)` which uses `window.ethereum` to send a transaction.
  - Ensure the contract's method names and argument shapes in your ABI match the call made by the UI (e.g., `execute(path)`).

7) Production considerations
  - Do not keep a funded private key in the repo. If you need automated execution, run a secure relayer on a server using a hardware wallet or KMS.
  - Consider a relayer pattern: the frontend monitors and sends signed requests to your server; the server evaluates and sends on-chain txs if profitable.
  - Rate-limit your DEX queries and use an archive node or dedicated provider if you need historical state or mempool access.

8) Security and testing
  - Run the contract on a forked mainnet or testnet (Goerli/Sepolia) and test the full flow.
  - Write unit tests for `scanForOpportunities` using known token pairs and mocked RPC responses.

9) Next steps (recommended)
  - Implement Uniswap V3 Quoter integration and gas estimation.
  - Add a server-side relayer option with authenticated API and signing.
  - Add event listeners (contract events) to show successful executions in the UI.
