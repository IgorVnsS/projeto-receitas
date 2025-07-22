import Link from "next/link"
import type { Category } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CategoryCardProps {
  category: Category
  recipeCount?: number
}

export default function CategoryCard({ category, recipeCount = 0 }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{category.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <Badge className={category.color}>{category.name}</Badge>
                <span className="text-sm text-gray-500">
                  {recipeCount} receita{recipeCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
