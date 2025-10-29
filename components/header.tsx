import Link from "next/link"
import { Logo } from "./logo"
import { MobileMenu } from "./mobile-menu"

export const Header = () => {
  return (
    <div className="fixed z-50 pt-4 md:pt-6 top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <header className="flex items-center justify-between container pb-4">
        <Link href="/" className="transition-transform hover:scale-105 duration-200">
          <Logo className="w-[100px] md:w-[120px]" />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-8">
          {[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Opportunities", href: "/opportunities" },
            { name: "Analytics", href: "/analytics" },
            { name: "Portfolio", href: "/portfolio" },
            { name: "Simulation", href: "/simulation" },
            { name: "Admin", href: "/admin" },
          ].map((item) => (
            <Link
              className="uppercase inline-block font-mono text-xs text-foreground/60 hover:text-primary duration-200 transition-colors ease-out relative group"
              href={item.href}
              key={item.name}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <Link
          className="uppercase max-lg:hidden transition-all ease-out duration-200 font-mono text-xs text-primary hover:text-primary/80 px-4 py-2 rounded-lg border border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          href="/dashboard"
        >
          Launch App
        </Link>
        <MobileMenu />
      </header>
    </div>
  )
}
