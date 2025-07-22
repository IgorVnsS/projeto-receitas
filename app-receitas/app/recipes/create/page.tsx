import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import RecipeForm from "@/components/RecipeForm"

export default async function CreateRecipePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RecipeForm />
    </div>
  )
}
