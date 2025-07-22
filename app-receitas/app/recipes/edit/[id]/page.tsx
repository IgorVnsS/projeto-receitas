import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/database"
import { getSession } from "@/lib/auth"
import RecipeForm from "@/components/RecipeForm"

interface EditRecipePageProps {
  params: {
    id: string
  }
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const session = await getSession()
  const recipe = db.recipes.findById(params.id)

  if (!session) {
    redirect("/login")
  }

  if (!recipe) {
    notFound()
  }

  if (recipe.authorId !== session.userId) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RecipeForm recipe={recipe} isEditing={true} />
    </div>
  )
}
