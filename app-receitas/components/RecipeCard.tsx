import Image from "next/image"
import Link from "next/link"
import type { RecipeWithCategory } from "@/lib/types"
import { Clock, Users, ChefHat } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FavoriteButton from "./FavoriteButton"

interface RecipeCardProps {
  recipe: RecipeWithCategory
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Médio":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          {recipe.category && (
            <Badge className={recipe.category.color}>
              <span className="mr-1">{recipe.category.icon}</span>
              {recipe.category.name}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{recipe.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime}min</span>
          </div>

          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} porções</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ChefHat className="h-4 w-4" />
            <span>{recipe.authorName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FavoriteButton recipeId={recipe.id} size="sm" variant="ghost" />
            <Link href={`/recipes/${recipe.id}`} className="text-orange-500 hover:text-orange-600 font-medium text-sm">
              Ver receita →
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
