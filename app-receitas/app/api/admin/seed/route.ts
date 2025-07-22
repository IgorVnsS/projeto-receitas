import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { seedDatabase } from "@/scripts/seed-database"

export async function POST() {
  try {
    const session = await getSession()

    // Verificar se o usuário está autenticado
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Executar script de seed
    await seedDatabase()

    return NextResponse.json({
      message: "Banco de dados populado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao executar script de seed:", error)
    return NextResponse.json(
      {
        error: "Erro ao executar script de seed",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
