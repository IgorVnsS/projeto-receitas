"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { RecipeWithCategory } from "@/lib/types"
import RecipeCard from "@/components/RecipeCard"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/favorites")

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar favoritos")
      }

      const data = await response.json()
      setFavoriteRecipes(data)
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
      setError("Erro ao carregar favoritos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Carregando favoritos...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar favoritos</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={fetchFavorites} className="bg-orange-500 hover:bg-orange-600">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Suas Receitas Favoritas</h1>
        </div>
        <p className="text-xl text-gray-600">
          {favoriteRecipes.length > 0
            ? `Você tem ${favoriteRecipes.length} receita${favoriteRecipes.length > 1 ? "s" : ""} favorita${favoriteRecipes.length > 1 ? "s" : ""}`
            : "Você ainda não tem receitas favoritas"}
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Nenhuma receita favorita ainda</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Explore nossas receitas e adicione suas favoritas clicando no ícone de coração
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recipes">
              <Button className="bg-orange-500 hover:bg-orange-600">Explorar Receitas</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
