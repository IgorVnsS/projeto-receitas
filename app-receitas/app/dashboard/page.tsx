import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, BookOpen, Heart, Users } from "lucide-react"
import RecipeCard from "@/components/RecipeCard"
import RecentFavorites from "@/components/RecentFavorites"
import connectDB from "@/lib/mongodb"
import Recipe from "@/lib/models/Recipe"
import Favorite from "@/lib/models/Favorite"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  try {
    await connectDB()

    // Buscar receitas do usuário
    const userRecipes = await Recipe.find({ authorId: session.userId })
      .populate("categoryId", "name description slug color icon")
      .sort({ createdAt: -1 })
      .lean()

    // Buscar favoritos do usuário
    const userFavorites = await Favorite.find({ userId: session.userId })
      .populate({
        path: "recipeId",
        populate: {
          path: "categoryId",
          select: "name description slug color icon",
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    // Formatar receitas do usuário
    const formattedUserRecipes = userRecipes.map((recipe) => ({
      ...recipe,
      id: recipe._id.toString(),
      categoryId: recipe.categoryId._id.toString(),
      authorId: recipe.authorId.toString(),
      category: {
        ...recipe.categoryId,
        id: recipe.categoryId._id.toString(),
      },
    }))

    // Formatar favoritos
    const formattedFavorites = userFavorites
      .filter((fav) => fav.recipeId) // Filtrar favoritos válidos
      .map((favorite) => {
        const recipe = favorite.recipeId
        return {
          ...recipe,
          id: recipe._id.toString(),
          categoryId: recipe.categoryId._id.toString(),
          authorId: recipe.authorId.toString(),
          category: {
            ...recipe.categoryId,
            id: recipe.categoryId._id.toString(),
          },
        }
      })

    const totalRecipes = formattedUserRecipes.length
    const totalFavorites = formattedFavorites.length
    const totalViews = formattedUserRecipes.reduce((acc, recipe) => acc + recipe.servings * 10, 0)

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Olá, {session.name}!</h1>
          <p className="text-xl text-gray-600">Gerencie suas receitas e acompanhe seu progresso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                  <p className="text-3xl font-bold text-gray-900">{totalRecipes}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visualizações</p>
                  <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receitas Favoritas</p>
                  <p className="text-3xl font-bold text-gray-900">{totalFavorites}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/recipes/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar Receitas
              </Button>
            </Link>
            <Link href="/favorites">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Ver Favoritos ({totalFavorites})
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Favorites */}
        {formattedFavorites.length > 0 && (
          <div className="mb-12">
            <RecentFavorites favorites={formattedFavorites} />
          </div>
        )}

        {/* User's Recipes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Suas Receitas</h2>
            {totalRecipes > 0 && (
              <Link href="/recipes/create">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova
                </Button>
              </Link>
            )}
          </div>

          {totalRecipes === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma receita ainda</h3>
                <p className="text-gray-600 mb-6">Comece compartilhando sua primeira receita com a comunidade</p>
                <Link href="/recipes/create">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Receita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedUserRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar dashboard</h1>
          <p className="text-gray-600">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }
}
