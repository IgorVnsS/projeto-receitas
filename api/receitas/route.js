// api/receitas/route.js
import { connectDB } from '@/lib/db'
import Receita from '@/models/Receita'

export async function GET() {
  await connectDB()
  const receitas = await Receita.find().populate('criadoPor', 'username')
  return new Response(JSON.stringify(receitas), { status: 200 })
}

export async function POST(req) {
  await connectDB()
  const dados = await req.json()
  const nova = await Receita.create(dados)
  return new Response(JSON.stringify(nova), { status: 201 })
}
