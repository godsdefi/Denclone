"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, TrendingUp } from "lucide-react"

interface Trade {
  id: number
  tokenPair: string
  profit: string
  percentage: string
  dex: string
  timestamp: string
}

export function LiveTicker() {
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1,
      tokenPair: "ETH/USDC",
      profit: "$1,234.56",
      percentage: "+2.4%",
      dex: "Uniswap→SushiSwap",
      timestamp: "2s ago",
    },
    {
      id: 2,
      tokenPair: "WBTC/ETH",
      profit: "$892.31",
      percentage: "+1.8%",
      dex: "Curve→Balancer",
      timestamp: "5s ago",
    },
    {
      id: 3,
      tokenPair: "LINK/USDT",
      profit: "$2,156.78",
      percentage: "+3.2%",
      dex: "PancakeSwap→1inch",
      timestamp: "8s ago",
    },
    { id: 4, tokenPair: "UNI/ETH", profit: "$567.89", percentage: "+1.5%", dex: "Uniswap→Curve", timestamp: "12s ago" },
    {
      id: 5,
      tokenPair: "AAVE/USDC",
      profit: "$1,789.45",
      percentage: "+2.9%",
      dex: "SushiSwap→Balancer",
      timestamp: "15s ago",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const newTrade: Trade = {
        id: Date.now(),
        tokenPair: ["ETH/USDC", "WBTC/ETH", "LINK/USDT", "UNI/ETH", "AAVE/USDC"][Math.floor(Math.random() * 5)],
        profit: `$${(Math.random() * 2000 + 500).toFixed(2)}`,
        percentage: `+${(Math.random() * 3 + 1).toFixed(1)}%`,
        dex: ["Uniswap→SushiSwap", "Curve→Balancer", "PancakeSwap→1inch"][Math.floor(Math.random() * 3)],
        timestamp: "just now",
      }
      setTrades((prev) => [newTrade, ...prev.slice(0, 4)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-primary/20 rounded-2xl py-3">
      <div className="flex items-center gap-2 px-4 mb-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono text-primary uppercase tracking-wider">Live Arbitrage Feed</span>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-left gap-6 px-4">
          {[...trades, ...trades].map((trade, idx) => (
            <div
              key={`${trade.id}-${idx}`}
              className="flex items-center gap-3 bg-black/60 rounded-xl px-4 py-2 border border-primary/10 whitespace-nowrap min-w-fit"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground font-medium">{trade.tokenPair}</span>
                <ArrowUpRight className="w-3 h-3 text-primary" />
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="font-mono text-sm text-primary font-semibold">{trade.profit}</span>
              <span className="font-mono text-xs text-primary/80">{trade.percentage}</span>
              <div className="h-4 w-px bg-border" />
              <span className="font-mono text-xs text-foreground/60">{trade.dex}</span>
              <span className="font-mono text-xs text-foreground/40">{trade.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
