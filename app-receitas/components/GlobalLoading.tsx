"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { ChefHat, Loader2 } from "lucide-react"

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  // Escutar eventos customizados para mostrar/esconder loading
  useEffect(() => {
    const handleStartLoading = () => setIsLoading(true)
    const handleStopLoading = () => setIsLoading(false)

    window.addEventListener("startLoading", handleStartLoading)
    window.addEventListener("stopLoading", handleStopLoading)

    return () => {
      window.removeEventListener("startLoading", handleStartLoading)
      window.removeEventListener("stopLoading", handleStopLoading)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <ChefHat className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Carregando...</h2>
        <p className="text-gray-500">Preparando sua experiência culinária</p>
      </div>
    </div>
  )
}
