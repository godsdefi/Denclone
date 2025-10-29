"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  color: string
  name: string
  radius: number
  pulsePhase: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  fromNode: string
  toNode: string
}

export function NetworkConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const nodesRef = useRef<Node[]>([])
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const dexs = [
      { name: "Uniswap", color: "#FF007A" },
      { name: "SushiSwap", color: "#FFC700" },
      { name: "Curve", color: "#40649F" },
      { name: "Balancer", color: "#FFC700" },
      { name: "PancakeSwap", color: "#D1884F" },
      { name: "1inch", color: "#94A6C3" },
      { name: "Aave", color: "#B6509E" },
      { name: "Compound", color: "#00D395" },
    ]

    nodesRef.current = dexs.map((dex, i) => {
      const angle = (i / dexs.length) * Math.PI * 2
      const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2

      return {
        id: dex.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: dex.color,
        name: dex.name,
        radius: 20,
        pulsePhase: Math.random() * Math.PI * 2,
      }
    })

    const createParticle = () => {
      if (nodesRef.current.length < 2) return

      const fromNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)]
      const toNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)]

      if (fromNode.id === toNode.id) return

      const dx = toNode.x - fromNode.x
      const dy = toNode.y - fromNode.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const speed = 2

      particlesRef.current.push({
        x: fromNode.x,
        y: fromNode.y,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        life: 0,
        maxLife: distance / speed,
        fromNode: fromNode.id,
        toNode: toNode.id,
      })
    }

    const animate = () => {
      timeRef.current += 0.016

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      ctx.strokeStyle = "rgba(255, 199, 0, 0.03)"
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.offsetHeight)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.offsetWidth, y)
        ctx.stroke()
      }

      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2

      nodesRef.current.forEach((node, i) => {
        const angle = (i / nodesRef.current.length) * Math.PI * 2 + timeRef.current * 0.1
        const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35
        const targetX = centerX + Math.cos(angle) * radius
        const targetY = centerY + Math.sin(angle) * radius

        node.x += (targetX - node.x) * 0.05
        node.y += (targetY - node.y) * 0.05
      })

      nodesRef.current.forEach((node, i) => {
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 300) {
            const opacity = (1 - distance / 300) * 0.2
            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y)
            gradient.addColorStop(0, `rgba(255, 199, 0, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(255, 199, 0, ${opacity * 1.5})`)
            gradient.addColorStop(1, `rgba(255, 199, 0, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()

            const flowProgress = (timeRef.current * 0.5) % 1
            const flowX = node.x + dx * flowProgress
            const flowY = node.y + dy * flowProgress

            ctx.fillStyle = `rgba(255, 199, 0, ${opacity * 3})`
            ctx.beginPath()
            ctx.arc(flowX, flowY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      })

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 1

        if (particle.life >= particle.maxLife) return false

        const progress = particle.life / particle.maxLife
        const opacity = Math.sin(progress * Math.PI) * 0.8

        // Draw particle trail
        ctx.fillStyle = `rgba(255, 199, 0, ${opacity * 0.3})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw particle core
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      // Create new particles periodically
      if (Math.random() < 0.05) {
        createParticle()
      }

      nodesRef.current.forEach((node) => {
        const isHovered = hoveredNode === node.id
        const pulseSize = Math.sin(timeRef.current * 2 + node.pulsePhase) * 3

        // Outer pulse ring
        ctx.strokeStyle = `rgba(255, 199, 0, ${0.3 + Math.sin(timeRef.current * 2 + node.pulsePhase) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + pulseSize + 10, 0, Math.PI * 2)
        ctx.stroke()

        // Glow effect
        if (isHovered) {
          ctx.shadowBlur = 30
          ctx.shadowColor = "#FFC700"
        } else {
          ctx.shadowBlur = 15
          ctx.shadowColor = node.color
        }

        // Node background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Node circle with gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius + pulseSize)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Border
        ctx.strokeStyle = isHovered ? "#FFC700" : "rgba(255, 199, 0, 0.5)"
        ctx.lineWidth = isHovered ? 3 : 2
        ctx.stroke()

        ctx.shadowBlur = 0

        ctx.fillStyle = "#FFFFFF"
        ctx.font = `bold ${isHovered ? 14 : 12}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.name.substring(0, 2).toUpperCase(), node.x, node.y)

        // Label
        if (isHovered) {
          ctx.fillStyle = "#FFC700"
          ctx.font = "bold 13px monospace"
          ctx.textAlign = "center"
          ctx.textBaseline = "top"
          ctx.fillText(node.name, node.x, node.y + node.radius + 15)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [hoveredNode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredNode = nodesRef.current.find((node) => {
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < node.radius + 5
    })

    setHoveredNode(hoveredNode?.id || null)
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-primary/20 rounded-3xl p-6 h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sentient text-xl text-foreground">DEX Network Constellation</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">Live Routing</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[420px] rounded-2xl cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />
    </div>
  )
}
