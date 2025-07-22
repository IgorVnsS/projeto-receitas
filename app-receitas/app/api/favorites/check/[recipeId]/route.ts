import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Favorite from "@/lib/models/Favorite"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { recipeId: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.recipeId)) {
      return NextResponse.json({
        isFavorited: false,
        favoritesCount: 0,
      })
    }

    const session = await getSession()
    let isFavorited = false

    if (session) {
      const favorite = await Favorite.findOne({
        userId: session.userId,
        recipeId: params.recipeId,
      })
      isFavorited = !!favorite
    }

    const favoritesCount = await Favorite.countDocuments({
      recipeId: params.recipeId,
    })

    return NextResponse.json({
      isFavorited,
      favoritesCount,
    })
  } catch (error) {
    console.error("Erro ao verificar favorito:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
