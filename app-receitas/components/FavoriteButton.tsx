"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  recipeId: string
  initialIsFavorited?: boolean
  initialFavoritesCount?: number
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  showCount?: boolean
  className?: string
}

export default function FavoriteButton({
  recipeId,
  initialIsFavorited = false,
  initialFavoritesCount = 0,
  size = "default",
  variant = "outline",
  showCount = false,
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar status inicial do favorito
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check/${recipeId}`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.isFavorited)
          setFavoritesCount(data.favoritesCount)
        }
      } catch (error) {
        console.error("Erro ao verificar status do favorito:", error)
      }
    }

    checkFavoriteStatus()
  }, [recipeId])

  const handleToggleFavorite = async () => {
    setIsLoading(true)

    try {
      const method = isFavorited ? "DELETE" : "POST"
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      })

      if (response.status === 401) {
        // Redirecionar para login se não autenticado
        window.location.href = "/login"
        return
      }

      if (response.ok) {
        setIsFavorited(!isFavorited)
        setFavoritesCount((prev) => (isFavorited ? prev - 1 : prev + 1))
      } else {
        const errorData = await response.json()
        console.error("Erro ao alterar favorito:", errorData.error)
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={cn("transition-all duration-200", isFavorited && "text-red-500 hover:text-red-600", className)}
    >
      <Heart
        className={cn("h-4 w-4", size === "sm" && "h-3 w-3", size === "lg" && "h-5 w-5", isFavorited && "fill-current")}
      />
      {showCount && favoritesCount > 0 && <span className="ml-1 text-sm">{favoritesCount}</span>}
      {!showCount && size !== "sm" && (
        <span className="ml-2 hidden sm:inline">
          {isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        </span>
      )}
    </Button>
  )
}
