import { ethers } from 'ethers'
import ABI from '../contracts/DenExecutor.abi'

// This file provides helpers to connect to the deployed contract on mainnet.
// We use ethers for signer interactions in the browser, and viem/public client helpers
// for lightweight read-only calls if desired. You can choose to standardize on one.

export const getProvider = () => {
  const rpc = process.env.NEXT_PUBLIC_ETHEREUM_RPC
  if (!rpc) throw new Error('NEXT_PUBLIC_ETHEREUM_RPC is not set')
  return new ethers.providers.JsonRpcProvider(rpc)
}

export const getContract = (provider?: ethers.providers.Provider) => {
  const addr = process.env.NEXT_PUBLIC_DEN_CONTRACT_ADDRESS
  if (!addr) throw new Error('NEXT_PUBLIC_DEN_CONTRACT_ADDRESS not set')
  const p = provider ?? getProvider()
  return new ethers.Contract(addr, ABI as any, p)
}

export const getContractReadOnly = () => {
  return getContract()
}

export const checkArbitrageOpportunity = async (tokenA: string, tokenB: string, amount: string) => {
  const contract = getContract()
  // callStatic to avoid state changes
  try {
    const [profitable, profit] = await contract.callStatic.checkArbitrageOpportunity(tokenA, tokenB, amount)
    return { profitable, profit }
  } catch (err) {
    console.error('checkArbitrageOpportunity error', err)
    return { profitable: false, profit: '0' }
  }
}

export const calculateExpectedProfit = async (tokenA: string, tokenB: string, amount: string, dexPath: string[] = []) => {
  const contract = getContract()
  try {
    const profit = await contract.callStatic.calculateExpectedProfit(tokenA, tokenB, amount, dexPath)
    return profit
  } catch (err) {
    console.error('calculateExpectedProfit error', err)
    return '0'
  }
}

export const estimateGasCost = async (dexPath: string[], data: string[] = []) => {
  const contract = getContract()
  try {
    const gas = await contract.callStatic.estimateGasCost(dexPath, data)
    return gas
  } catch (err) {
    console.error('estimateGasCost error', err)
    return '0'
  }
}

export const listenToContractEvents = (onArbitrageExecuted?: (...args: any[]) => void, onProfitGenerated?: (...args: any[]) => void) => {
  const contract = getContract()
  if (onArbitrageExecuted) {
    contract.on('ArbitrageExecuted', onArbitrageExecuted)
  }
  if (onProfitGenerated) {
    contract.on('ProfitGenerated', onProfitGenerated)
  }
  return () => {
    try {
      if (onArbitrageExecuted) contract.off('ArbitrageExecuted', onArbitrageExecuted)
      if (onProfitGenerated) contract.off('ProfitGenerated', onProfitGenerated)
    } catch (err) {
      console.warn('error removing listeners', err)
    }
  }
}

export const getSignerContract = async (ethereum: any) => {
  if (!ethereum) throw new Error('No web3 provider provided')
  const web3Provider = new ethers.providers.Web3Provider(ethereum)
  await web3Provider.send('eth_requestAccounts', [])
  const signer = web3Provider.getSigner()
  const contract = getContract(web3Provider).connect(signer)
  return { contract, signer }
}

export type ExecuteTxOptions = {
  value?: string // ether value in wei as string
}

export const executeOnChain = async (ethereum: any, methodName: string, args: any[] = [], opts?: ExecuteTxOptions) => {
  const { contract } = await getSignerContract(ethereum)
  const tx = await (contract as any)[methodName](...args, { value: opts?.value })
  return tx
}
