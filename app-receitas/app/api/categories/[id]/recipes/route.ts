import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Recipe from "@/lib/models/Recipe"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID de categoria inválido" }, { status: 400 })
    }

    const category = await Category.findById(params.id).lean()
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }

    const recipes = await Recipe.find({ categoryId: params.id })
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

    return NextResponse.json({
      category: formattedCategory,
      recipes: formattedRecipes,
    })
  } catch (error) {
    console.error("Erro ao buscar receitas da categoria:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
