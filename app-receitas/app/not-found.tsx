import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ChefHat className="h-24 w-24 text-orange-500 mx-auto mb-8" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Receita não encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A receita que você está procurando não existe ou foi removida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">Voltar ao Início</Button>
          </Link>
          <Link href="/recipes">
            <Button variant="outline">Ver Todas as Receitas</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
