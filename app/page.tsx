"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Welcome to FlowPywr</h1>
      <p className="text-gray-700">Select an option from the sidebar to get started.</p>
    </div>
  )
}
