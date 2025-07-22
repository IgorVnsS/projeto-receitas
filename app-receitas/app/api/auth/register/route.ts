import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, createSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await createSession(user._id.toString(), user.email, user.name)

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: { id: user._id.toString(), email: user.email, name: user.name },
    })
  } catch (error: any) {
    console.error("Erro no registro:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
