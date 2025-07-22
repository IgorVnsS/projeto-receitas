import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    // Verificar se o usuário está autenticado
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter dados da categoria
    const categoryData = await request.json()

    // Validar dados
    if (
      !categoryData.name ||
      !categoryData.description ||
      !categoryData.slug ||
      !categoryData.color ||
      !categoryData.icon
    ) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Conectar ao banco de dados
    const { db } = await connectDB()

    // Verificar se já existe uma categoria com o mesmo slug
    const existingCategory = await db.collection("categories").findOne({ slug: categoryData.slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Já existe uma categoria com este slug" }, { status: 400 })
    }

    // Criar a categoria
    const now = new Date()
    const category = {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("categories").insertOne(category)

    return NextResponse.json(
      {
        ...category,
        id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
