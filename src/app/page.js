// src/app/page.js
import { connectDB } from '@/lib/db'
import Receita from '@/models/Receita'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  await connectDB()
  const receitas = await Receita.find()

  // Agrupa receitas por categoria
  const categorias = receitas.reduce((acc, receita) => {
    if (!acc[receita.categoria]) acc[receita.categoria] = []
    acc[receita.categoria].push(receita)
    return acc
  }, {})

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Receitas por Categoria</h1>
      {Object.entries(categorias).map(([categoria, lista]) => (
        <div key={categoria} className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{categoria}</h2>
          <ul className="space-y-3">
            {lista.map(receita => (
              <li key={receita._id} className="p-4 bg-gray-100 rounded">
                <strong>{receita.titulo}</strong><br />
                <small>{receita.descricao}</small>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}