"use client"

import { useEffect, useState } from "react"

export function GasOptimizationMeter() {
  const [savings, setSavings] = useState(0)
  const [targetSavings, setTargetSavings] = useState(45)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [gasData, setGasData] = useState({ standard: 0, optimized: 0 })

  useEffect(() => {
    const cycle = setInterval(() => {
      setIsOptimizing(true)
      const newTarget = 40 + Math.random() * 25 // 40-65%
      setTargetSavings(newTarget)

      const standardGas = 120000 + Math.random() * 80000
      const optimizedGas = standardGas * (1 - newTarget / 100)

      setGasData({
        standard: Math.round(standardGas),
        optimized: Math.round(optimizedGas),
      })

      // Smooth animation to target
      let current = savings
      const duration = 1500
      const steps = 60
      const increment = (newTarget - current) / steps
      let step = 0

      const animation = setInterval(() => {
        step++
        current += increment
        setSavings(current)

        if (step >= steps) {
          setSavings(newTarget)
          setIsOptimizing(false)
          clearInterval(animation)
        }
      }, duration / steps)

      return () => clearInterval(animation)
    }, 4000)

    return () => clearInterval(cycle)
  }, [savings])

  const percentage = Math.min(Math.max(savings, 0), 100)
  const angle = (percentage / 100) * 270 - 135 // -135 to 135 degrees

  return (
    <div className="rounded-3xl border border-border bg-background/40 backdrop-blur-sm p-5 h-[360px] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,199,0,0.4) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mb-3 flex-shrink-0">
        <h3 className="text-lg font-sentient mb-1">Gas Optimizer</h3>
        <p className="font-mono text-[10px] text-foreground/60">AI-powered transaction cost reduction</p>
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 160 160">
          {/* Background arc */}
          <path
            d="M 20 130 A 60 60 0 1 1 140 130"
            fill="none"
            stroke="rgba(255,199,0,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d="M 20 130 A 60 60 0 1 1 140 130"
            fill="none"
            stroke="rgb(255,199,0)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="282.7"
            strokeDashoffset={282.7 - (282.7 * percentage) / 100}
            className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,199,0,0.6)]"
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((val) => {
            const tickAngle = -135 + (val / 100) * 270
            const rad = (tickAngle * Math.PI) / 180
            const x1 = 80 + Math.cos(rad) * 52
            const y1 = 130 + Math.sin(rad) * 52
            const x2 = 80 + Math.cos(rad) * 58
            const y2 = 130 + Math.sin(rad) * 58

            return <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,199,0,0.3)" strokeWidth="1.5" />
          })}

          {/* Center value */}
          <text
            x="80"
            y="115"
            textAnchor="middle"
            className="fill-primary font-mono font-bold"
            style={{ fontSize: "32px" }}
          >
            {percentage.toFixed(0)}
          </text>
          <text
            x="80"
            y="128"
            textAnchor="middle"
            className="fill-foreground/60 font-mono"
            style={{ fontSize: "10px" }}
          >
            % SAVED
          </text>
        </svg>

        {isOptimizing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-primary/30 animate-ping" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 grid grid-cols-2 gap-2.5 flex-shrink-0">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5">
          <div className="font-mono text-[9px] text-foreground/60 mb-0.5">Standard</div>
          <div className="font-mono text-sm text-red-400 font-semibold">{gasData.standard.toLocaleString()}</div>
          <div className="font-mono text-[9px] text-foreground/50">gas</div>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-2.5">
          <div className="font-mono text-[9px] text-foreground/60 mb-0.5">Optimized</div>
          <div className="font-mono text-sm text-primary font-semibold">{gasData.optimized.toLocaleString()}</div>
          <div className="font-mono text-[9px] text-foreground/50">gas</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
