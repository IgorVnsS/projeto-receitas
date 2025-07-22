"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteRecipeButtonProps {
  recipeId: string
}

export default function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta receita? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar receita")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Erro ao deletar receita:", error)
      alert("Erro ao deletar receita. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? "Deletando..." : "Deletar"}
    </Button>
  )
}
