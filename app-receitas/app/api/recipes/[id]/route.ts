import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Recipe from "@/lib/models/Recipe"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 })
    }

    const recipe = await Recipe.findById(params.id).populate("categoryId", "name description slug color icon").lean()

    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 })
    }

    const formattedRecipe = {
      ...recipe,
      id: recipe._id.toString(),
      categoryId: recipe.categoryId._id.toString(),
      authorId: recipe.authorId.toString(),
      category: {
        ...recipe.categoryId,
        id: recipe.categoryId._id.toString(),
      },
    }

    return NextResponse.json(formattedRecipe)
  } catch (error) {
    console.error("Erro ao buscar receita:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 })
    }

    const recipe = await Recipe.findById(params.id)
    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 })
    }

    if (recipe.authorId.toString() !== session.userId) {
      return NextResponse.json({ error: "Não autorizado a editar esta receita" }, { status: 403 })
    }

    const recipeData = await request.json()

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      params.id,
      { ...recipeData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("categoryId", "name description slug color icon")

    const formattedRecipe = {
      ...updatedRecipe.toObject(),
      id: updatedRecipe._id.toString(),
      categoryId: updatedRecipe.categoryId._id.toString(),
      authorId: updatedRecipe.authorId.toString(),
      category: {
        ...updatedRecipe.categoryId,
        id: updatedRecipe.categoryId._id.toString(),
      },
    }

    return NextResponse.json(formattedRecipe)
  } catch (error: any) {
    console.error("Erro ao atualizar receita:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID de receita inválido" }, { status: 400 })
    }

    const recipe = await Recipe.findById(params.id)
    if (!recipe) {
      return NextResponse.json({ error: "Receita não encontrada" }, { status: 404 })
    }

    if (recipe.authorId.toString() !== session.userId) {
      return NextResponse.json({ error: "Não autorizado a deletar esta receita" }, { status: 403 })
    }

    await Recipe.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Receita deletada com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar receita:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
