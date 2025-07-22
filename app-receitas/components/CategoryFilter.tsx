"use client"

import { useState, useEffect } from "react"
import type { Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string | null) => void
  selectedCategory?: string | null
}

export default function CategoryFilter({ onCategoryChange, selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtrar por categoria</h3>
        {selectedCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtro
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={selectedCategory === null ? "bg-orange-500 hover:bg-orange-600" : ""}
        >
          Todas
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`${selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : ""} flex items-center space-x-1`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-2">
          <Badge variant="outline" className="text-sm">
            Filtrando por: {categories.find((cat) => cat.id === selectedCategory)?.name}
          </Badge>
        </div>
      )}
    </div>
  )
}
