"use client"

import { useState, useEffect } from "react"

interface UseFavoritesReturn {
  isFavorited: boolean
  favoritesCount: number
  isLoading: boolean
  toggleFavorite: () => Promise<void>
}

export function useFavorites(recipeId: string): UseFavoritesReturn {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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

  const toggleFavorite = async () => {
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

      if (response.ok) {
        setIsFavorited(!isFavorited)
        setFavoritesCount((prev) => (isFavorited ? prev - 1 : prev + 1))
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao alterar favorito")
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFavorited,
    favoritesCount,
    isLoading,
    toggleFavorite,
  }
}
