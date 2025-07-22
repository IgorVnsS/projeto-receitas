"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChefHat, Menu, X, LogOut, Plus } from "lucide-react"
import { AUTH_EVENTS, dispatchAuthEvent } from "@/lib/authEvents"
import { useGlobalLoading } from "@/lib/loading"

interface User {
  id: string
  email: string
  name: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const loading = useGlobalLoading()

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
    }
  }

  // Verificar autenticação na montagem do componente
  useEffect(() => {
    checkAuth()

    // Configurar listeners para eventos de autenticação
    const handleLogin = (event: any) => {
      setUser(event.detail.user)
    }

    const handleLogout = () => {
      setUser(null)
    }

    // Adicionar event listeners
    window.addEventListener(AUTH_EVENTS.LOGIN, handleLogin)
    window.addEventListener(AUTH_EVENTS.REGISTER, handleLogin)
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout)

    // Limpar event listeners na desmontagem
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleLogin)
      window.removeEventListener(AUTH_EVENTS.REGISTER, handleLogin)
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout)
    }
  }, [])

  const handleLogout = async () => {
    try {
      loading.show()
      await fetch("/api/auth/logout", { method: "POST" })

      // Disparar evento de logout
      dispatchAuthEvent(AUTH_EVENTS.LOGOUT)

      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      loading.hide()
    }
  }

  const handleNavigation = (href: string) => {
    loading.show()
    router.push(href)
    setIsMenuOpen(false)
  }

  // Componente para usuário autenticado
  const AuthenticatedNav = () => (
    <>
      <button
        onClick={() => handleNavigation("/dashboard")}
        className="text-gray-700 hover:text-orange-500 transition-colors"
      >
        Dashboard
      </button>
      <button
        onClick={() => handleNavigation("/favorites")}
        className="text-gray-700 hover:text-orange-500 transition-colors"
      >
        Favoritos
      </button>
      <Button
        size="sm"
        className="bg-orange-500 hover:bg-orange-600"
        onClick={() => handleNavigation("/recipes/create")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Receita
      </Button>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">Olá, {user?.name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-gray-700 hover:text-red-600 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </>
  )

  // Componente para usuário não autenticado
  const UnauthenticatedNav = () => (
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm" onClick={() => handleNavigation("/login")}>
        Entrar
      </Button>
      <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => handleNavigation("/register")}>
        Cadastrar
      </Button>
    </div>
  )

  // Componente para navegação móvel autenticada
  const AuthenticatedMobileNav = () => (
    <>
      <button
        onClick={() => handleNavigation("/dashboard")}
        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-500"
      >
        Dashboard
      </button>
      <button
        onClick={() => handleNavigation("/favorites")}
        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-500"
      >
        Favoritos
      </button>
      <button
        onClick={() => handleNavigation("/recipes/create")}
        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-500"
      >
        Nova Receita
      </button>
      <div className="px-3 py-2 text-sm text-gray-700">Olá, {user?.name}</div>
      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600">
        Sair
      </button>
    </>
  )

  // Componente para navegação móvel não autenticada
  const UnauthenticatedMobileNav = () => (
    <>
      <button
        onClick={() => handleNavigation("/login")}
        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-500"
      >
        Entrar
      </button>
      <button
        onClick={() => handleNavigation("/register")}
        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-500"
      >
        Cadastrar
      </button>
    </>
  )

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">SuperReceitas</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              Início
            </Link>
            <Link href="/recipes" className="text-gray-700 hover:text-orange-500 transition-colors">
              Receitas
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-orange-500 transition-colors">
              Categorias
            </Link>

            {user ? <AuthenticatedNav /> : <UnauthenticatedNav />}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/recipes"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Receitas
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorias
              </Link>

              {user ? <AuthenticatedMobileNav /> : <UnauthenticatedMobileNav />}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
