"use client"

import { useState, useEffect } from "react"
import type { RecipeWithCategory } from "@/lib/types"
import RecipeCard from "@/components/RecipeCard"
import CategoryFilter from "@/components/CategoryFilter"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeWithCategory[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes")
        if (response.ok) {
          const data = await response.json()
          setRecipes(data)
          setFilteredRecipes(data)
        }
      } catch (error) {
        console.error("Erro ao carregar receitas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  useEffect(() => {
    let filtered = recipes

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter((recipe) => recipe.categoryId === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRecipes(filtered)
  }, [recipes, selectedCategory, searchTerm])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Todas as Receitas</h1>
        <p className="text-xl text-gray-600">Descubra receitas incríveis compartilhadas pela nossa comunidade</p>
      </div>

      {/* Filtros */}
      <div className="mb-8 space-y-6">
        {/* Busca */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro de categorias */}
        <CategoryFilter onCategoryChange={setSelectedCategory} selectedCategory={selectedCategory} />
      </div>

      {/* Resultados */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredRecipes.length === 0
            ? "Nenhuma receita encontrada"
            : `${filteredRecipes.length} receita${filteredRecipes.length > 1 ? "s" : ""} encontrada${filteredRecipes.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedCategory
              ? "Nenhuma receita encontrada com os filtros aplicados."
              : "Nenhuma receita encontrada. Seja o primeiro a compartilhar uma receita!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
