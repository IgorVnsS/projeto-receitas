// api/auth/register.js
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  await connectDB()
  const { username, password } = await req.json()

  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, password: hash })

  return new Response(JSON.stringify({ success: true }), { status: 201 })
}
