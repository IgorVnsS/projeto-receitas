import Link from "next/link"
import Image from "next/image"
import type { Recipe } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Users } from "lucide-react"

interface RecentFavoritesProps {
  favorites: Recipe[]
}

export default function RecentFavorites({ favorites }: RecentFavoritesProps) {
  const recentFavorites = favorites.slice(0, 3)

  if (recentFavorites.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            <span>Favoritos Recentes</span>
          </CardTitle>
          {favorites.length > 3 && (
            <Link href="/favorites">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentFavorites.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{recipe.title}</h4>
              <p className="text-sm text-gray-500 truncate">{recipe.authorName}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.prepTime + recipe.cookTime}min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings}</span>
                </div>
              </div>
            </div>
            <Link href={`/recipes/${recipe.id}`}>
              <Button variant="ghost" size="sm">
                Ver
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
