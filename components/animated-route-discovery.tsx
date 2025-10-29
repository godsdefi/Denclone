"use client"

import { useEffect, useState } from "react"

interface RouteStep {
  dex: string
  status: "idle" | "scanning" | "analyzing" | "complete" | "optimal"
  price: number
  liquidity: number
  progress: number
}

export function AnimatedRouteDiscovery() {
  const [routes, setRoutes] = useState<RouteStep[]>([
    { dex: "Uniswap", status: "idle", price: 0, liquidity: 0, progress: 0 },
    { dex: "Sushi", status: "idle", price: 0, liquidity: 0, progress: 0 },
    { dex: "Curve", status: "idle", price: 0, liquidity: 0, progress: 0 },
    { dex: "Balancer", status: "idle", price: 0, liquidity: 0, progress: 0 },
  ])
  const [scanPhase, setScanPhase] = useState(0)
  const [optimalIndex, setOptimalIndex] = useState<number | null>(null)

  useEffect(() => {
    const cycle = setInterval(() => {
      setScanPhase((prev) => {
        const next = (prev + 1) % 6

        if (next === 0) {
          // Reset all routes
          setRoutes((routes) => routes.map((r) => ({ ...r, status: "idle", price: 0, liquidity: 0, progress: 0 })))
          setOptimalIndex(null)
        } else if (next <= 4) {
          // Scan each DEX sequentially
          setRoutes((routes) =>
            routes.map((r, i) => {
              if (i === next - 1) {
                return {
                  ...r,
                  status: "scanning",
                  progress: 100,
                  price: 1800 + Math.random() * 100,
                  liquidity: 500000 + Math.random() * 500000,
                }
              } else if (i < next - 1) {
                return { ...r, status: "complete", progress: 100 }
              }
              return r
            }),
          )
        } else if (next === 5) {
          // Identify optimal route
          const bestIdx = 2 // Curve
          setOptimalIndex(bestIdx)
          setRoutes((routes) =>
            routes.map((r, i) => ({
              ...r,
              status: i === bestIdx ? "optimal" : "complete",
            })),
          )
        }

        return next
      })
    }, 1200)

    return () => clearInterval(cycle)
  }, [])

  return (
    <div className="rounded-3xl border border-border bg-background/40 backdrop-blur-sm p-5 h-[360px] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,199,0,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,199,0,0.3)_1px,transparent_1px)]"
          style={{ backgroundSize: "20px 20px" }}
        />
      </div>

      <div className="relative z-10 mb-4 flex-shrink-0">
        <h3 className="text-lg font-sentient mb-1">Multi-DEX Route Scanner</h3>
        <p className="font-mono text-[10px] text-foreground/60">Parallel algorithm execution across liquidity pools</p>
      </div>

      <div className="relative flex-1 space-y-2.5">
        {routes.map((route, i) => {
          const isActive = route.status === "scanning"
          const isComplete = route.status === "complete" || route.status === "optimal"
          const isOptimal = route.status === "optimal"

          return (
            <div
              key={i}
              className={`relative rounded-xl border transition-all duration-500 ${
                isOptimal
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,199,0,0.3)]"
                  : isActive
                    ? "border-primary/50 bg-primary/5"
                    : isComplete
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-border/30 bg-background/20"
              }`}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {route.status === "idle" && <div className="w-2 h-2 rounded-full bg-foreground/20" />}
                    {route.status === "scanning" && (
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                    {route.status === "complete" && (
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {route.status === "optimal" && (
                      <svg className="w-5 h-5 text-primary animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <div className="font-mono text-xs font-semibold">{route.dex}</div>
                    {isComplete && (
                      <div className="font-mono text-[10px] text-foreground/50">
                        ${route.price.toFixed(2)} • ${(route.liquidity / 1000).toFixed(0)}K
                      </div>
                    )}
                  </div>
                </div>

                {isOptimal && (
                  <div className="font-mono text-[10px] text-primary font-bold px-2 py-1 rounded bg-primary/20">
                    BEST
                  </div>
                )}
              </div>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      animation: "progress 1.2s ease-in-out",
                      width: "100%",
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-3 gap-3 flex-shrink-0">
        <div className="text-center">
          <div className="font-mono text-lg text-primary">{scanPhase > 0 && scanPhase < 5 ? scanPhase : 4}</div>
          <div className="font-mono text-[9px] text-foreground/60">SCANNED</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg text-primary">{optimalIndex !== null ? "2.84%" : "--"}</div>
          <div className="font-mono text-[9px] text-foreground/60">PROFIT</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg text-primary">{scanPhase * 180}ms</div>
          <div className="font-mono text-[9px] text-foreground/60">LATENCY</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
