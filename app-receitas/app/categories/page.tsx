import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import Recipe from "@/lib/models/Recipe"
import CategoryCard from "@/components/CategoryCard"

export default async function CategoriesPage() {
  try {
    await connectDB()

    const categories = await Category.find({}).sort({ name: 1 }).lean()

    // Contar receitas por categoria
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const recipeCount = await Recipe.countDocuments({ categoryId: category._id })
        return {
          ...category,
          id: category._id.toString(),
          recipeCount,
        }
      }),
    )

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Categorias de Receitas</h1>
          <p className="text-xl text-gray-600">
            Explore receitas organizadas por categoria e encontre exatamente o que você procura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCount.map((category) => (
            <CategoryCard key={category.id} category={category} recipeCount={category.recipeCount} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar categorias:", error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar categorias</h1>
          <p className="text-gray-600">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }
}
