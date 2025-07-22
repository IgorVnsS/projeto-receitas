import { ChefHat } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ChefHat className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Preparando sua receita...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    </div>
  )
}
