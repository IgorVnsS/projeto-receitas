import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"

export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find({}).sort({ name: 1 }).lean()

    // Converter _id para id para compatibilidade com o frontend
    const formattedCategories = categories.map((category) => ({
      ...category,
      id: category._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
