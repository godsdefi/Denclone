"use client"

import { useState, useEffect } from "react"

interface HeatmapCell {
  hour: number
  day: string
  value: number
  profit: string
}

export function ProfitHeatmap() {
  const [data, setData] = useState<HeatmapCell[]>([])
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const hours = Array.from({ length: 12 }, (_, i) => i * 2)

  useEffect(() => {
    const generateData = () => {
      const newData: HeatmapCell[] = []
      days.forEach((day) => {
        hours.forEach((hour) => {
          const value = Math.random() * 100
          newData.push({
            hour,
            day,
            value,
            profit: `$${(value * 50).toFixed(0)}`,
          })
        })
      })
      setData(newData)
    }
    generateData()

    // Update data every 5 seconds for live effect
    const interval = setInterval(generateData, 5000)
    return () => clearInterval(interval)
  }, [])

  const getColor = (value: number) => {
    if (value < 20) return "bg-primary/10"
    if (value < 40) return "bg-primary/30"
    if (value < 60) return "bg-primary/50"
    if (value < 80) return "bg-primary/70"
    return "bg-primary"
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-primary/20 rounded-3xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sentient text-lg text-foreground">Opportunities Heatmap</h3>
        <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">5-Day View</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          <div className="w-10" />
          <div className="flex-1 grid grid-cols-12 gap-1">
            {hours.map((hour) => (
              <div key={hour} className="text-[9px] font-mono text-foreground/40 text-center">
                {hour}
              </div>
            ))}
          </div>
        </div>

        {days.map((day) => (
          <div key={day} className="flex gap-1.5 items-center">
            <div className="w-10 text-[10px] font-mono text-foreground/60">{day}</div>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {hours.map((hour) => {
                const cell = data.find((d) => d.day === day && d.hour === hour)
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`aspect-square rounded ${getColor(cell?.value || 0)} hover:ring-2 hover:ring-primary transition-all cursor-pointer group relative`}
                    title={`${day} ${hour}:00 - ${cell?.profit || "$0"}`}
                  >
                    <div className="absolute hidden group-hover:block bg-black/90 border border-primary/30 rounded px-2 py-1 text-xs font-mono whitespace-nowrap -top-10 left-1/2 -translate-x-1/2 z-10">
                      <div className="text-primary">{cell?.profit}</div>
                      <div className="text-foreground/60">
                        {day} {hour}:00
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/10">
        <span className="text-[10px] font-mono text-foreground/60">Low</span>
        <div className="flex gap-1">
          {[10, 30, 50, 70, 100].map((val) => (
            <div key={val} className={`w-3 h-3 rounded ${getColor(val)}`} />
          ))}
        </div>
        <span className="text-[10px] font-mono text-foreground/60">High</span>
      </div>
    </div>
  )
}
