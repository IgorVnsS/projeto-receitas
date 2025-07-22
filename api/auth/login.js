// api/auth/login.js
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { gerarToken } from '@/lib/auth'

export async function POST(req) {
  await connectDB()
  const { username, password } = await req.json()

  const user = await User.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ error: "Credenciais inválidas" }), { status: 401 })
  }

  const token = gerarToken(user._id)
  return new Response(JSON.stringify({ token }), { status: 200 })
}
