"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category {
  id?: string
  name: string
  description: string
  slug: string
  color: string
  icon: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    description: "",
    slug: "",
    color: "bg-blue-100 text-blue-800",
    icon: "🍽️",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
      setError("Erro ao carregar categorias. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Gerar slug automaticamente a partir do nome
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
        slug,
      }))
    } else {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar categoria")
      }

      const data = await response.json()
      setCategories((prev) => [...prev, data])
      setSuccess("Categoria criada com sucesso!")

      // Limpar formulário
      setNewCategory({
        name: "",
        description: "",
        slug: "",
        color: "bg-blue-100 text-blue-800",
        icon: "🍽️",
      })

      // Recarregar categorias
      fetchCategories()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorOptions = [
    { value: "bg-red-100 text-red-800", label: "Vermelho" },
    { value: "bg-blue-100 text-blue-800", label: "Azul" },
    { value: "bg-green-100 text-green-800", label: "Verde" },
    { value: "bg-yellow-100 text-yellow-800", label: "Amarelo" },
    { value: "bg-purple-100 text-purple-800", label: "Roxo" },
    { value: "bg-pink-100 text-pink-800", label: "Rosa" },
    { value: "bg-orange-100 text-orange-800", label: "Laranja" },
    { value: "bg-indigo-100 text-indigo-800", label: "Índigo" },
    { value: "bg-amber-100 text-amber-800", label: "Âmbar" },
    { value: "bg-emerald-100 text-emerald-800", label: "Esmeralda" },
  ]

  const iconOptions = [
    "🍽️",
    "🍰",
    "🍕",
    "🥤",
    "🍝",
    "🥩",
    "🥗",
    "🎂",
    "🥪",
    "🍲",
    "☕",
    "🍷",
    "🍺",
    "🍹",
    "🍦",
    "🍔",
    "🍟",
    "🌮",
    "🌯",
    "🍣",
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
          <p className="text-gray-600">Adicione e gerencie categorias de receitas</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário para adicionar categoria */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Nova Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria</Label>
                  <Input id="name" name="name" value={newCategory.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" value={newCategory.slug} onChange={handleInputChange} required />
                  <p className="text-xs text-gray-500">Identificador único para URLs (gerado automaticamente)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={`h-8 rounded-md cursor-pointer border-2 ${
                          newCategory.color === color.value ? "border-black" : "border-transparent"
                        } ${color.value}`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, color: color.value }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <div className="grid grid-cols-10 gap-2">
                    {iconOptions.map((icon) => (
                      <div
                        key={icon}
                        className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer border-2 ${
                          newCategory.icon === icon ? "border-black" : "border-transparent"
                        } hover:bg-gray-100`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, icon }))}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Categoria
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lista de categorias */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Categorias Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma categoria encontrada. Adicione sua primeira categoria!
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${category.color}`}>{category.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
