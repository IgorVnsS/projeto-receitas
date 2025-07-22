import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Tag, Database } from "lucide-react"

export default async function AdminPage() {
  const session = await getSession()

  // Verificar se o usuário está autenticado
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
        <p className="text-gray-600">Gerencie receitas, categorias e usuários</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/recipes">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                Gerenciar Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Adicione, edite ou remova receitas do site</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Acessar</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-orange-500" />
                Gerenciar Categorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Adicione, edite ou remova categorias de receitas</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Acessar</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/database">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-orange-500" />
                Gerenciar Banco de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Execute scripts de seed e backup do banco de dados</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Acessar</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
