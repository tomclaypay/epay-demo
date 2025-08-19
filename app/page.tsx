"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/deposit")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold font-serif text-foreground mb-2">Chào mừng đến với Exness</h1>
              <p className="text-muted-foreground">Đang chuyển hướng...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
