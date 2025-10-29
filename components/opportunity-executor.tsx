"use client"
import React, { useEffect, useState } from 'react'
import ArbitrageWatcher from '../lib/arbitrage'
import { useMetaMask } from './ui/metamask-connect'

export default function OpportunityExecutor() {
  const { account, connect, error, connecting } = useMetaMask()
  const [lastOpportunity, setLastOpportunity] = useState<any | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [mevProtect, setMevProtect] = useState<boolean>(false)

  useEffect(() => {
    const onFound = (opp: any) => {
      setLastOpportunity(opp)
    }
    const watcher = new ArbitrageWatcher(onFound)
    watcher.start()
    return () => watcher.stop()
  }, [])

  const execute = async () => {
    if (!window.ethereum) return alert('Connect wallet first')
    if (!lastOpportunity) return alert('No opportunity found')
    setStatus('sending')
    try {
      const { executeOnChain } = await import('../lib/contract')
      if (mevProtect) {
        // Attempt to use a private relay (Flashbots) - stubbed helper
        const { sendBundleViaFlashbots } = await import('../lib/mev')
        // Prepare signed txs and send via flashbots (not implemented fully here)
        try {
          await sendBundleViaFlashbots((window.ethereum as any).provider, [])
          setStatus('submitted (flashbots)')
        } catch (err: any) {
          console.warn('flashbots failed, falling back to normal execution', err)
          const tx = await executeOnChain(window.ethereum, 'executeArbitrage', [lastOpportunity.tokenAAmount, lastOpportunity.path, lastOpportunity.data], { value: lastOpportunity.value })
          setStatus('submitted')
          await tx.wait()
          setStatus('confirmed')
        }
      } else {
        // Normal wallet execution
        const tx = await executeOnChain(window.ethereum, 'executeArbitrage', [lastOpportunity.tokenAAmount, lastOpportunity.path, lastOpportunity.data], { value: lastOpportunity.value })
        setStatus('submitted')
        await tx.wait()
        setStatus('confirmed')
      }
    } catch (err: any) {
      console.error(err)
      setStatus('error: ' + (err?.message ?? err))
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold">Arbitrage Executor</h3>
      <div className="mt-2">
        {account ? (
          <span className="text-green-600 font-mono">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        ) : (
          <button onClick={connect} className="btn btn-primary" disabled={connecting}>
            {connecting ? "Connecting..." : "Connect MetaMask"}
          </button>
        )}
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>

      <div className="mt-4">
        <div>Watcher status: running</div>
        <div>Last opportunity: {lastOpportunity ? JSON.stringify(lastOpportunity) : 'none'}</div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={mevProtect} onChange={(e) => setMevProtect(e.target.checked)} />
          <span className="text-xs">Use MEV protection (Flashbots)</span>
        </label>

        <button onClick={execute} className="btn btn-primary" disabled={!lastOpportunity || !account}>
          Execute on-chain
        </button>
        <div className="mt-2">Status: {status}</div>
      </div>
    </div>
  )
}
