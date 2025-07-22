// models/Receita.js
import mongoose from 'mongoose'

const ReceitaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  ingredientes: [String],
  categoria: String,
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.models.Receita || mongoose.model('Receita', ReceitaSchema)
