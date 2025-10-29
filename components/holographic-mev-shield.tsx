"use client"

import { useEffect, useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"

interface Attack {
  id: number
  type: string
  x: number
  y: number
  blocked: boolean
}

export function HolographicMEVShield() {
  const [shieldActive, setShieldActive] = useState(true)
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [blockedCount, setBlockedCount] = useState(0)

  useEffect(() => {
    const shieldInterval = setInterval(() => {
      setShieldActive((prev) => !prev)
    }, 3000)
    return () => clearInterval(shieldInterval)
  }, [])

  useEffect(() => {
    const attackInterval = setInterval(() => {
      const newAttack: Attack = {
        id: Date.now(),
        type: ["Sandwich", "Frontrun", "Backrun"][Math.floor(Math.random() * 3)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10,
        blocked: shieldActive,
      }

      setAttacks((prev) => [...prev, newAttack])

      if (shieldActive) {
        setBlockedCount((prev) => prev + 1)
      }

      setTimeout(() => {
        setAttacks((prev) => prev.filter((a) => a.id !== newAttack.id))
      }, 2000)
    }, 1500)

    return () => clearInterval(attackInterval)
  }, [shieldActive])

  return (
    <div className="rounded-3xl border border-border bg-background/40 backdrop-blur-sm p-6 h-[420px] relative overflow-hidden flex flex-col">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at center, rgb(255, 199, 0) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-4 flex-shrink-0">
        <h3 className="text-xl font-sentient mb-1">MEV Protection Shield</h3>
        <p className="font-mono text-xs text-foreground/60">
          Real-time defense against sandwich attacks and frontrunning
        </p>
      </div>

      {/* Central shield visualization */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {/* Shield rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute rounded-full border-2 transition-all duration-1000 ${
                shieldActive ? "border-primary/40" : "border-primary/10"
              }`}
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                animation: shieldActive ? `ping ${2 + i * 0.5}s ease-in-out infinite` : "none",
              }}
            />
          ))}
        </div>

        {/* Central shield icon */}
        <div
          className={`relative z-10 w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
            shieldActive
              ? "border-primary bg-primary/20 shadow-[0_0_40px_rgba(255,199,0,0.5)]"
              : "border-primary/30 bg-background/60"
          }`}
        >
          <Shield
            className={`w-10 h-10 transition-colors duration-500 ${shieldActive ? "text-primary" : "text-primary/40"}`}
          />
        </div>

        {/* Attack particles */}
        {attacks.map((attack) => (
          <div
            key={attack.id}
            className="absolute transition-all duration-500"
            style={{
              left: `${attack.x}%`,
              top: `${attack.y}%`,
              animation: attack.blocked ? "bounce 0.5s ease-out" : "none",
            }}
          >
            {attack.blocked ? (
              <div className="relative">
                <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
                <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-red-500/80 rounded-full animate-pulse" />
            )}
          </div>
        ))}

        {/* Hexagonal grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse">
              <path
                d="M25 0 L50 14.43 L50 28.87 L25 43.3 L0 28.87 L0 14.43 Z"
                fill="none"
                stroke="rgb(255, 199, 0)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-4 grid grid-cols-3 gap-4 flex-shrink-0">
        <div className="text-center">
          <div className="font-mono text-xl text-primary mb-1">{blockedCount}</div>
          <div className="font-mono text-xs text-foreground/60">Blocked</div>
        </div>
        <div className="text-center">
          <div className={`font-mono text-xl mb-1 ${shieldActive ? "text-green-500" : "text-red-500"}`}>
            {shieldActive ? "ACTIVE" : "STANDBY"}
          </div>
          <div className="font-mono text-xs text-foreground/60">Status</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-xl text-primary mb-1">99.9%</div>
          <div className="font-mono text-xs text-foreground/60">Success</div>
        </div>
      </div>
    </div>
  )
}
