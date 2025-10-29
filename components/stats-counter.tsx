"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { TrendingUp, Shield, Zap, DollarSign } from "lucide-react"

interface Stat {
  label: string
  value: number
  suffix: string
  prefix?: string
  icon: React.ReactNode
  trend?: string
}

export function StatsCounter() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Total Volume Processed",
      value: 0,
      suffix: "M",
      prefix: "$",
      icon: <DollarSign className="w-5 h-5" />,
      trend: "+12.5%",
    },
    {
      label: "Successful Trades Today",
      value: 0,
      suffix: "+",
      icon: <TrendingUp className="w-5 h-5" />,
      trend: "+8.3%",
    },
    { label: "MEV Attacks Prevented", value: 0, suffix: "+", icon: <Shield className="w-5 h-5" />, trend: "+15.2%" },
    { label: "Avg Response Time", value: 0, suffix: "ms", icon: <Zap className="w-5 h-5" /> },
  ])

  const targetValues = [247.8, 1847, 3421, 127]

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats((prevStats) =>
        prevStats.map((stat, idx) => ({
          ...stat,
          value: Math.floor(targetValues[idx] * progress),
        })),
      )

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats((prevStats) =>
          prevStats.map((stat, idx) => ({
            ...stat,
            value: targetValues[idx],
          })),
        )
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-black/40 backdrop-blur-sm border border-primary/20 rounded-3xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,199,0,0.1)]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-primary/80">{stat.icon}</div>
            {stat.trend && (
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">{stat.trend}</span>
            )}
          </div>
          <div className="font-sentient text-3xl text-foreground mb-1">
            {stat.prefix}
            {stat.value.toLocaleString()}
            {stat.suffix}
          </div>
          <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
