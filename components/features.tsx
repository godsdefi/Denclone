"use client"

import { Pill } from "./pill"
import { Activity, Shield, Zap, Target, Play, TestTube } from "lucide-react"
import { useEffect, useState } from "react"

const features = [
  {
    icon: Activity,
    title: "Real-Time Price Monitoring",
    description: "Multi-source aggregation from Chainlink, Pyth, RedStone oracles",
    details: [
      "DEX monitoring across Uniswap V2/V3, SushiSwap, PancakeSwap, Balancer, Curve, DODO",
      "Aggregator integration with 1inch, ParaSwap, 0x Protocol",
      "TWAP calculations with deviation thresholds",
      "Price validation and staleness checks",
    ],
    visualization: "price-monitor",
  },
  {
    icon: Target,
    title: "Advanced Path Finding",
    description: "Multiple algorithms for optimal arbitrage routes",
    details: [
      "Dijkstra, Yen K-Shortest, MMBF, Bellman-Ford, A* algorithms",
      "Concurrent path discovery with configurable timeouts",
      "Path validation with liquidity and slippage checks",
      "Multi-hop arbitrage support (up to 4 hops)",
    ],
    visualization: "path-finding",
  },
  {
    icon: Shield,
    title: "MEV Protection",
    description: "Flashbots integration for private mempool submission",
    details: [
      "Multiple MEV builders: Flashbots, Titan, Beaver, Eden Network",
      "Sandwich attack detection with price impact analysis",
      "Frontrunning protection with gas price monitoring",
      "Bundle creation with optimal bribe calculation",
    ],
    visualization: "mev-protection",
  },
  {
    icon: Zap,
    title: "Risk Management",
    description: "Circuit breakers and comprehensive safety controls",
    details: [
      "Volatility and price impact circuit breakers",
      "Position size limits and daily volume caps",
      "Slippage protection with configurable thresholds",
      "Emergency stop functionality",
    ],
    visualization: "risk-management",
  },
  {
    icon: Play,
    title: "Execution Engine",
    description: "Automated and manual execution with flash loan integration",
    details: [
      "Automated execution with configurable triggers",
      "Flash loan integration via Aave",
      "Gas optimization with dynamic pricing",
      "Transaction monitoring and status tracking",
    ],
    visualization: "execution",
  },
  {
    icon: TestTube,
    title: "Simulation Engine",
    description: "Off-chain validation and strategy testing",
    details: [
      "Call static simulation for transaction validation",
      "Dry run mode for testing strategies",
      "Risk assessment for each opportunity",
      "Profit calculation with slippage and fees",
    ],
    visualization: "simulation",
  },
]

function PriceMonitorViz() {
  const [prices, setPrices] = useState([1850, 1852, 1849, 1851])

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => prev.map((p) => p + (Math.random() - 0.5) * 3))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32 flex items-end justify-around gap-2 mb-6">
      {prices.map((price, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-primary/20 border border-primary/40 transition-all duration-500"
            style={{ height: `${(price / 1900) * 100}%` }}
          />
          <span className="font-mono text-[10px] text-primary">${price.toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

function PathFindingViz() {
  const [activeNode, setActiveNode] = useState(0)
  const nodes = [0, 1, 2, 3]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32 flex items-center justify-center mb-6">
      <div className="relative w-full h-full">
        {nodes.map((node, i) => (
          <div
            key={i}
            className={`absolute w-8 h-8 border-2 rounded-full transition-all duration-300 ${
              activeNode === i ? "bg-primary border-primary scale-110" : "border-primary/40"
            }`}
            style={{
              left: `${(i % 2) * 60 + 20}%`,
              top: `${Math.floor(i / 2) * 60 + 20}%`,
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="30%" y1="30%" x2="70%" y2="30%" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
          <line x1="30%" y1="30%" x2="30%" y2="70%" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
          <line x1="70%" y1="30%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
          <line x1="30%" y1="70%" x2="70%" y2="70%" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
        </svg>
      </div>
    </div>
  )
}

function MEVProtectionViz() {
  const [shielded, setShielded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShielded((prev) => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32 flex items-center justify-center mb-6">
      <div className="relative">
        <div
          className={`w-20 h-20 border-2 border-primary/40 rounded-full flex items-center justify-center transition-all duration-500 ${
            shielded ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(255,199,0,0.3)]" : ""
          }`}
        >
          <Shield
            className={`w-10 h-10 transition-colors duration-500 ${shielded ? "text-primary" : "text-primary/40"}`}
          />
        </div>
        {shielded && <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />}
      </div>
    </div>
  )
}

function RiskManagementViz() {
  const [level, setLevel] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(Math.random() * 100)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const color = level > 70 ? "text-red-500" : level > 40 ? "text-primary" : "text-green-500"

  return (
    <div className="h-32 flex items-center justify-center mb-6">
      <div className="w-full max-w-[200px]">
        <div className="h-4 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${color.replace("text-", "bg-")} transition-all duration-500`}
            style={{ width: `${level}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[10px] text-foreground/40">LOW</span>
          <span className={`font-mono text-[10px] ${color}`}>{level.toFixed(0)}%</span>
          <span className="font-mono text-[10px] text-foreground/40">HIGH</span>
        </div>
      </div>
    </div>
  )
}

function ExecutionViz() {
  const [executing, setExecuting] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setExecuting(true)
      setTimeout(() => setExecuting(false), 1000)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32 flex items-center justify-center mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary/40 rounded flex items-center justify-center">
          <span className="font-mono text-xs text-primary">TX</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                executing ? "bg-primary" : "bg-primary/20"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <div
          className={`w-12 h-12 border-2 rounded flex items-center justify-center transition-all duration-300 ${
            executing ? "border-primary bg-primary/10" : "border-primary/40"
          }`}
        >
          <span className="font-mono text-xs text-primary">✓</span>
        </div>
      </div>
    </div>
  )
}

function SimulationViz() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-32 flex flex-col items-center justify-center mb-6 gap-3">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 border transition-all duration-300 ${
              (i * 12.5) <= progress ? "border-primary bg-primary/20" : "border-primary/20"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-primary">{progress}%</span>
    </div>
  )
}

function FeatureVisualization({ type }: { type: string }) {
  switch (type) {
    case "price-monitor":
      return <PriceMonitorViz />
    case "path-finding":
      return <PathFindingViz />
    case "mev-protection":
      return <MEVProtectionViz />
    case "risk-management":
      return <RiskManagementViz />
    case "execution":
      return <ExecutionViz />
    case "simulation":
      return <SimulationViz />
    default:
      return null
  }
}

export function Features() {
  return (
    <section id="features" className="min-h-screen py-32 relative">
      <div className="container">
        <div className="text-center mb-20">
          <Pill className="mb-6">CORE FEATURES</Pill>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Enterprise-grade <br />
            <i className="font-light">arbitrage infrastructure</i>
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
            Built for professional traders with institutional-grade security and performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border bg-background/40 backdrop-blur-sm p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,199,0,0.1)]"
            >
              <FeatureVisualization type={feature.visualization} />

              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-sentient mb-3">{feature.title}</h3>
              <p className="font-mono text-sm text-foreground/60 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="font-mono text-xs text-foreground/50 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
