import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react" // Declare the ChefHat variable

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Descubra receitas
                <span className="block text-yellow-300">BASEDS</span>
              </h1>
              <p className="text-xl text-orange-100">
                Compartilhe suas receitas favoritas e descubra novos sabores da culinária dos campeões
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/recipes">
                  <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                    Explorar Receitas
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-orange-500 bg-transparent"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="https://www.shutterstock.com/image-photo/african-american-head-cook-garnishing-600nw-2152369899.jpg"
                alt="Chef cozinhando"
                fill
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher SuperReceitas?</h2>
          <p className="text-xl text-gray-600">A plataforma completa para amantes da culinária</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Receitas Organizadas</h3>
            <p className="text-gray-600">Encontre receitas organizadas por categoria, dificuldade e tempo de preparo</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❤️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sistema de Favoritos</h3>
            <p className="text-gray-600">Salve suas receitas favoritas e acesse-as facilmente quando quiser</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
            <p className="text-gray-600">Compartilhe suas receitas e descubra criações de outros cozinheiros</p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore por Categoria</h2>
          <p className="text-xl text-gray-600">Encontre receitas organizadas por tipo de prato</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Doces", icon: "🍰", color: "bg-pink-100 text-pink-800" },
            { name: "Salgados", icon: "🍕", color: "bg-orange-100 text-orange-800" },
            { name: "Bebidas", icon: "🥤", color: "bg-blue-100 text-blue-800" },
            { name: "Massas", icon: "🍝", color: "bg-yellow-100 text-yellow-800" },
            { name: "Carnes", icon: "🥩", color: "bg-red-100 text-red-800" },
            { name: "Vegetariano", icon: "🥗", color: "bg-green-100 text-green-800" },
            { name: "Bolos", icon: "🎂", color: "bg-purple-100 text-purple-800" },
            { name: "Lanches", icon: "🥪", color: "bg-indigo-100 text-indigo-800" },
          ].map((category) => (
            <Link
              key={category.name}
              href="/categories"
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-center">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/categories">
            <Button variant="outline" size="lg">
              Ver Todas as Categorias
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Pronto para começar a exalar tempero?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Junte-se à nossa comunidade e comece a compartilhar suas receitas favoritas hoje mesmo
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 mt-5">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
