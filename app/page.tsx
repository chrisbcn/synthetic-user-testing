"use client"

import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  console.log("[v0] HomePage rendering, isAuthenticated:", isAuthenticated)

  if (!isAuthenticated) {
    console.log("[v0] Showing LoginForm")
    return <LoginForm />
  }

  console.log("[v0] Showing Dashboard")
  return <Dashboard />
}
