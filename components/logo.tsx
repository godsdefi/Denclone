import type React from "react"
export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text className="font-sans"
        x="0"
        y="30"
        fill="white"
        fontSize="32"
        fontWeight="700"
        fontFamily="var(--font-geist-mono)"
        letterSpacing="-0.02em"
      >
        DENWEN
      </text>
    </svg>
  )
}
