import type { User, Recipe, Favorite, Category, RecipeWithCategory } from "./types"

// Simulação de banco de dados em memória
const users: User[] = []

const categories: Category[] = [
  {
    id: "1",
    name: "Doces",
    description: "Sobremesas, bolos, tortas e guloseimas",
    slug: "doces",
    color: "bg-pink-100 text-pink-800",
    icon: "🍰",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Salgados",
    description: "Pratos principais, lanches e petiscos salgados",
    slug: "salgados",
    color: "bg-orange-100 text-orange-800",
    icon: "🍕",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bebidas",
    description: "Sucos, vitaminas, drinks e bebidas quentes",
    slug: "bebidas",
    color: "bg-blue-100 text-blue-800",
    icon: "🥤",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Massas",
    description: "Massas, lasanhas, nhoque e pratos italianos",
    slug: "massas",
    color: "bg-yellow-100 text-yellow-800",
    icon: "🍝",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Carnes",
    description: "Pratos com carne bovina, suína, frango e peixes",
    slug: "carnes",
    color: "bg-red-100 text-red-800",
    icon: "🥩",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Vegetariano",
    description: "Pratos vegetarianos e veganos",
    slug: "vegetariano",
    color: "bg-green-100 text-green-800",
    icon: "🥗",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Bolos",
    description: "Bolos simples, decorados e cupcakes",
    slug: "bolos",
    color: "bg-purple-100 text-purple-800",
    icon: "🎂",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Brigadeiro Gourmet",
    description: "Delicioso brigadeiro gourmet com chocolate belga",
    ingredients: [
      "400ml leite condensado",
      "3 colheres de sopa de chocolate em pó",
      "1 colher de sopa de manteiga",
      "Chocolate granulado",
    ],
    instructions: [
      "Misture todos os ingredientes em uma panela",
      "Cozinhe em fogo baixo mexendo sempre",
      "Quando desgrudar do fundo está pronto",
      "Deixe esfriar e faça bolinhas",
      "Passe no chocolate granulado",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 20,
    difficulty: "Fácil",
    categoryId: "1", // Doces
    image: "https://www.receitasnestle.com.br/sites/default/files/srh_recipes/1a884bcbc5b04d71476d2995d51d0140.jpg",
    authorId: "system",
    authorName: "Chef Sistema",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Bolo de Cenoura",
    description: "Confira essa clássica receita de bolo de cenoura simples e fácil!",
    ingredients: [
      "1/2 xícara (chá) de óleo",
      "4 ovos",
      "2 e 1/2 xícaras (chá) de farinha de trigo",
      "3 cenouras médias raladas",
      "2 xícaras (chá) de açúcar",
      "1 colher (sopa) de fermento em pó",
    ],
    instructions: [
      "Em um liquidificador, adicione a cenoura, os ovos e o óleo, depois misture.",
      "Acrescente o açúcar e bata novamente por 5 minutos.",
      "Acrescente a farinha de trigo e misture.",
      "Acrescente o fermento e misture lentamente com uma colher.",
      "Asse em um forno preaquecido a 180° C por aproximadamente 40 minutos.",
    ],
    prepTime: 20,
    cookTime: 40,
    servings: 8,
    difficulty: "Médio",
    categoryId: "7", // Bolos
    image:
      "https://canaldareceita.com.br/wp-content/uploads/2025/01/BOLO-DE-CENOURA-FOFINHO-DE-LIQUIDIFICADOR.jpg.webp",
    authorId: "system",
    authorName: "Chef Sistema",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Salada Caesar",
    description: "Salada caesar clássica com molho cremoso e croutons crocantes",
    ingredients: [
      "1 pé de alface americana",
      "100g de queijo parmesão ralado",
      "2 fatias de pão de forma",
      "2 colheres de sopa de azeite",
      "2 colheres de sopa de maionese",
      "1 colher de sopa de mostarda",
      "Suco de 1/2 limão",
    ],
    instructions: [
      "Corte o pão em cubos e torre no forno com azeite",
      "Lave e corte a alface em pedaços",
      "Misture maionese, mostarda e limão para o molho",
      "Monte a salada com alface, molho e croutons",
      "Finalize com queijo parmesão ralado",
    ],
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "Fácil",
    categoryId: "6", // Vegetariano
    image: "/placeholder.svg?height=300&width=400&text=Salada+Caesar",
    authorId: "system",
    authorName: "Chef Sistema",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const favorites: Favorite[] = []

export const db = {
  users: {
    findByEmail: (email: string): User | undefined => {
      return users.find((user) => user.email === email)
    },
    findById: (id: string): User | undefined => {
      return users.find((user) => user.id === id)
    },
    create: (userData: Omit<User, "id" | "createdAt">): User => {
      const user: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      return user
    },
  },
  categories: {
    findAll: (): Category[] => {
      return categories.sort((a, b) => a.name.localeCompare(b.name))
    },
    findById: (id: string): Category | undefined => {
      return categories.find((category) => category.id === id)
    },
    findBySlug: (slug: string): Category | undefined => {
      return categories.find((category) => category.slug === slug)
    },
    create: (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Category => {
      const category: Category = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      categories.push(category)
      return category
    },
    update: (id: string, categoryData: Partial<Category>): Category | null => {
      const index = categories.findIndex((category) => category.id === id)
      if (index === -1) return null

      categories[index] = {
        ...categories[index],
        ...categoryData,
        updatedAt: new Date().toISOString(),
      }
      return categories[index]
    },
    delete: (id: string): boolean => {
      const index = categories.findIndex((category) => category.id === id)
      if (index === -1) return false

      categories.splice(index, 1)
      return true
    },
  },
  recipes: {
    findAll: (): RecipeWithCategory[] => {
      return recipes
        .map((recipe) => ({
          ...recipe,
          category: categories.find((cat) => cat.id === recipe.categoryId),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    findById: (id: string): RecipeWithCategory | undefined => {
      const recipe = recipes.find((recipe) => recipe.id === id)
      if (!recipe) return undefined

      return {
        ...recipe,
        category: categories.find((cat) => cat.id === recipe.categoryId),
      }
    },
    findByCategory: (categoryId: string): RecipeWithCategory[] => {
      return recipes
        .filter((recipe) => recipe.categoryId === categoryId)
        .map((recipe) => ({
          ...recipe,
          category: categories.find((cat) => cat.id === recipe.categoryId),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    findByAuthor: (authorId: string): RecipeWithCategory[] => {
      return recipes
        .filter((recipe) => recipe.authorId === authorId)
        .map((recipe) => ({
          ...recipe,
          category: categories.find((cat) => cat.id === recipe.categoryId),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
    create: (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">): Recipe => {
      const recipe: Recipe = {
        ...recipeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      recipes.push(recipe)
      return recipe
    },
    update: (id: string, recipeData: Partial<Recipe>): Recipe | null => {
      const index = recipes.findIndex((recipe) => recipe.id === id)
      if (index === -1) return null

      recipes[index] = {
        ...recipes[index],
        ...recipeData,
        updatedAt: new Date().toISOString(),
      }
      return recipes[index]
    },
    delete: (id: string): boolean => {
      const index = recipes.findIndex((recipe) => recipe.id === id)
      if (index === -1) return false

      recipes.splice(index, 1)
      return true
    },
  },
  favorites: {
    findByUser: (userId: string): Favorite[] => {
      return favorites.filter((favorite) => favorite.userId === userId)
    },
    findByRecipe: (recipeId: string): Favorite[] => {
      return favorites.filter((favorite) => favorite.recipeId === recipeId)
    },
    findByUserAndRecipe: (userId: string, recipeId: string): Favorite | undefined => {
      return favorites.find((favorite) => favorite.userId === userId && favorite.recipeId === recipeId)
    },
    create: (userId: string, recipeId: string): Favorite => {
      const favorite: Favorite = {
        id: Date.now().toString(),
        userId,
        recipeId,
        createdAt: new Date().toISOString(),
      }
      favorites.push(favorite)
      return favorite
    },
    delete: (userId: string, recipeId: string): boolean => {
      const index = favorites.findIndex((favorite) => favorite.userId === userId && favorite.recipeId === recipeId)
      if (index === -1) return false
      favorites.splice(index, 1)
      return true
    },
    getFavoriteRecipes: (userId: string): RecipeWithCategory[] => {
      const userFavorites = favorites.filter((favorite) => favorite.userId === userId)
      return userFavorites
        .map((favorite) => recipes.find((recipe) => recipe.id === favorite.recipeId))
        .filter((recipe): recipe is Recipe => recipe !== undefined)
        .map((recipe) => ({
          ...recipe,
          category: categories.find((cat) => cat.id === recipe.categoryId),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
  },
}
