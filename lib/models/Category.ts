import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  _id: string
  name: string
  description: string
  slug: string
  color: string
  icon: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Nome da categoria é obrigatório"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Descrição é obrigatória"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Cor é obrigatória"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Ícone é obrigatório"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Evitar criar o modelo se já existir
export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
