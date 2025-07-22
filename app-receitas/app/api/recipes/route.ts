import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Recipe from "@/lib/models/Recipe"
import Category from "@/lib/models/Category"
import User from "@/lib/models/User"

export async function GET() {
  try {
    await connectDB()

    const recipes = await Recipe.find({})
      .populate("categoryId", "name description slug color icon")
      .sort({ createdAt: -1 })
      .lean()

    // Formatar dados para o frontend
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

    return NextResponse.json(formattedRecipes)
  } catch (error) {
    console.error("Erro ao buscar receitas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const recipeData = await request.json()

    // Validar se a categoria existe
    const category = await Category.findById(recipeData.categoryId)
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 400 })
    }

    // Buscar dados do usuário
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 })
    }

    const recipe = await Recipe.create({
      ...recipeData,
      authorId: session.userId,
      authorName: user.name,
      image: recipeData.image || "/placeholder.svg?height=300&width=400",
    })

    // Popular a categoria para retornar dados completos
    await recipe.populate("categoryId", "name description slug color icon")

    const formattedRecipe = {
      ...recipe.toObject(),
      id: recipe._id.toString(),
      categoryId: recipe.categoryId._id.toString(),
      authorId: recipe.authorId.toString(),
      category: {
        ...recipe.categoryId,
        id: recipe.categoryId._id.toString(),
      },
    }

    return NextResponse.json(formattedRecipe, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar receita:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
