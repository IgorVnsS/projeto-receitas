// src/app/login/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUser] = useState('')
  const [password, setPass] = useState('')
  const router = useRouter()

  async function handleLogin() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

    if (res.ok) {
      const { token } = await res.json()
      localStorage.setItem('token', token)
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-12 bg-white rounded shadow">
      <h1 className="text-xl mb-4">Login</h1>
      <input placeholder="Usuário" className="input mb-2" value={username} onChange={e => setUser(e.target.value)} />
      <input type="password" placeholder="Senha" className="input mb-2" value={password} onChange={e => setPass(e.target.value)} />
      <button className="bg-blue-500 px-4 py-2 text-white rounded" onClick={handleLogin}>Entrar</button>
    </div>
  )
}
