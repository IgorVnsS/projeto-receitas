// lib/db.js
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

export async function connectDB() {
  if (mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("MongoDB conectado")
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB", err)
    throw err
  }
}
