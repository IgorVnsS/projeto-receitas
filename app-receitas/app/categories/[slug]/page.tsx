import { notFound } from "next/navigation"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Recipe from "@/lib/models/Recipe"
import RecipeCard from "@/components/RecipeCard"
import { Badge } from "@/components/ui/badge"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    await connectDB()

    const category = await Category.findOne({ slug: params.slug }).lean()
    if (!category) {
      notFound()
    }

    const recipes = await Recipe.find({ categoryId: category._id })
      .populate("categoryId", "name description slug color icon")
      .sort({ createdAt: -1 })
      .lean()

    // Formatar dados para o frontend
    const formattedCategory = {
      ...category,
      id: category._id.toString(),
    }

    const formattedRecipes = recipes.map((recipe) => ({
      ...recipe,
      id: recipe._id.toString(),
      categoryId: recipe.categoryId._id.toString(),
      authorId: recipe.authorId.toString(),
      category: {
        ...recipe.categoryId,
        id: recipe.categoryId._id.toString(),
      },
    }))

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{formattedCategory.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{formattedCategory.name}</h1>
              <p className="text-xl text-gray-600 mt-2">{formattedCategory.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className={formattedCategory.color}>{formattedCategory.name}</Badge>
            <span className="text-gray-600">
              {formattedRecipes.length} receita{formattedRecipes.length !== 1 ? "s" : ""} encontrada
              {formattedRecipes.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {formattedRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{formattedCategory.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Nenhuma receita de {formattedCategory.name.toLowerCase()} ainda
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Seja o primeiro a compartilhar uma receita nesta categoria!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/recipes/create"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Criar Receita
              </a>
              <a
                href="/recipes"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Ver Todas as Receitas
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar página da categoria:", error)
    notFound()
  }
}
