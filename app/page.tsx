"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LiveTicker } from "@/components/live-ticker"
import { StatsCounter } from "@/components/stats-counter"
import { HolographicPathfinder } from "@/components/holographic-pathfinder"
import { HolographicMEVShield } from "@/components/holographic-mev-shield"
import { AnimatedRouteDiscovery } from "@/components/animated-route-discovery"
import { GasOptimizationMeter } from "@/components/gas-optimization-meter"
import { Leva } from "leva"

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container py-12 space-y-12 relative z-10">
        {/* Live stats section */}
        <div className="space-y-6">
          <LiveTicker />
          <StatsCounter />
        </div>

        {/* Core technology showcase */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-sentient mb-2">Core Technology</h2>
            <p className="text-foreground/60 font-mono text-sm">Advanced algorithms powering DeFi arbitrage</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HolographicPathfinder />
            <HolographicMEVShield />
          </div>
        </div>

        {/* Real-time features */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-sentient mb-2">Live Performance</h2>
            <p className="text-foreground/60 font-mono text-sm">Watch our systems optimize in real-time</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedRouteDiscovery />
            <GasOptimizationMeter />
          </div>
        </div>
      </section>

      <Features />
      <Leva hidden />
    </>
  )
}
