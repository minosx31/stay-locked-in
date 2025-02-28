"use client"

import { Lock, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"
import { NavLink } from "react-router-dom"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="top-0 w-full border-b">
      <div className="flex h-fit p-2 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Lock className="h-6 w-6" />
          <span className="font-semibold">LOCKED IN</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/" className="transition-colors hover:text-foreground/80">
            Clocks
          </NavLink>
          <NavLink to="/pomodoro" className="transition-colors hover:text-foreground/80">
            Pomodoro
          </NavLink>
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}