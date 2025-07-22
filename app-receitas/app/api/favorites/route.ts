import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Favorite from "@/lib/models/Favorite"
import Recipe from "@/lib/models/Recipe"
import mongoose from "mongoose"

export async function GET() {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar favoritos do usuário
    const favorites = await Favorite.find({ userId: session.userId })
      .populate({
        path: "recipeId",
        populate: {
          path: "categoryId",
          select: "name description slug color icon",
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    // Filtrar favoritos válidos e formatar dados
    const favoriteRecipes = favorites
      .filter((fav) => fav.recipeId) // Filtrar favoritos com receitas válidas
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

    return NextResponse.json(favoriteRecipes)
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
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

    const { recipeId } = await request.json()

    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ error: "ID da receita é obrigatório e deve ser válido" }, { status: 400 })
    }

    // Verificar se a receita existe
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 })
    }

    // Verificar se já está favoritada
    const existingFavorite = await Favorite.findOne({
      userId: session.userId,
      recipeId: recipeId,
    })

    if (existingFavorite) {
      return NextResponse.json({ error: "Receita já está nos favoritos" }, { status: 400 })
    }

    const favorite = await Favorite.create({
      userId: session.userId,
      recipeId: recipeId,
    })

    return NextResponse.json(
      {
        message: "Receita adicionada aos favoritos",
        favorite: {
          id: favorite._id.toString(),
          userId: favorite.userId.toString(),
          recipeId: favorite.recipeId.toString(),
          createdAt: favorite.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Erro ao adicionar favorito:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Receita já está nos favoritos" }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { recipeId } = await request.json()

    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ error: "ID da receita é obrigatório e deve ser válido" }, { status: 400 })
    }

    const deleted = await Favorite.findOneAndDelete({
      userId: session.userId,
      recipeId: recipeId,
    })

    if (!deleted) {
      return NextResponse.json({ error: "Favorito não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Receita removida dos favoritos" })
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
