// lib/auth.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET

export function gerarToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: '7d' })
}

export function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch (e) {
    return null
  }
}
