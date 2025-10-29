import { ethers } from 'ethers'
import ABI from '../contracts/DenExecutor.abi'

// This file provides helpers to connect to the deployed contract on mainnet.
// We use ethers for signer interactions in the browser, and viem/public client helpers
// for lightweight read-only calls if desired. You can choose to standardize on one.

export const getProvider = () => {
  const rpc = process.env.NEXT_PUBLIC_ETHEREUM_RPC
  if (!rpc) throw new Error('NEXT_PUBLIC_ETHEREUM_RPC is not set')
  return new ethers.JsonRpcProvider(rpc)
}

export const getContract = (provider?: ethers.Provider) => {
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
  // use staticCall to avoid state changes (ethers v6)
  try {
    const result = await contract.checkArbitrageOpportunity.staticCall(tokenA, tokenB, amount)
    return { profitable: result[0], profit: result[1] }
  } catch (err) {
    console.error('checkArbitrageOpportunity error', err)
    return { profitable: false, profit: '0' }
  }
}

export const calculateExpectedProfit = async (tokenA: string, tokenB: string, amount: string, dexPath: string[] = []) => {
  const contract = getContract()
  try {
    const profit = await contract.calculateExpectedProfit.staticCall(tokenA, tokenB, amount, dexPath)
    return profit
  } catch (err) {
    console.error('calculateExpectedProfit error', err)
    return '0'
  }
}

export const estimateGasCost = async (dexPath: string[], data: string[] = []) => {
  const contract = getContract()
  try {
    const gas = await contract.estimateGasCost.staticCall(dexPath, data)
    return gas
  } catch (err) {
    console.error('estimateGasCost error', err)
    return '0'
  }
}

export const listenToContractEvents = (onArbitrageExecuted?: (...args: any[]) => void, onProfitGenerated?: (...args: any[]) => void) => {
  const contract = getContract()
  // In ethers v6, event listeners receive event objects - we need to extract args
  const arbitrageHandler = onArbitrageExecuted ? (event: any) => {
    // Extract event args: tokenBorrow (indexed), amount, profit, dexPath
    const tokenBorrow = event.args?.[0]
    const amount = event.args?.[1]
    const profit = event.args?.[2]
    const dexPath = event.args?.[3]
    onArbitrageExecuted(tokenBorrow, amount, profit, dexPath)
  } : undefined
  const profitHandler = onProfitGenerated ? (event: any) => {
    // Extract event args: profit, timestamp
    const profit = event.args?.[0]
    const timestamp = event.args?.[1]
    onProfitGenerated(profit, timestamp)
  } : undefined
  
  if (arbitrageHandler) {
    contract.on('ArbitrageExecuted', arbitrageHandler)
  }
  if (profitHandler) {
    contract.on('ProfitGenerated', profitHandler)
  }
  return () => {
    try {
      if (arbitrageHandler) contract.off('ArbitrageExecuted', arbitrageHandler)
      if (profitHandler) contract.off('ProfitGenerated', profitHandler)
    } catch (err) {
      console.warn('error removing listeners', err)
    }
  }
}

export const getSignerContract = async (ethereum: any) => {
  if (!ethereum) throw new Error('No web3 provider provided')
  const web3Provider = new ethers.BrowserProvider(ethereum)
  await web3Provider.send('eth_requestAccounts', [])
  const signer = await web3Provider.getSigner()
  const contract = getContract(web3Provider).connect(signer)
  return { contract, signer }
}

export type ExecuteTxOptions = {
  value?: string // ether value in wei as string
}

export const executeOnChain = async (ethereum: any, methodName: string, args: any[] = [], opts?: ExecuteTxOptions) => {
  const { contract } = await getSignerContract(ethereum)
  // In ethers v6, options are passed as the last argument if it's an object with value/gas/etc
  const methodArgs = opts?.value ? [...args, { value: opts.value }] : args
  const tx = await (contract as any)[methodName](...methodArgs)
  return tx
}
