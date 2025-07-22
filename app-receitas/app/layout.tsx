import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import GlobalLoading from "@/components/GlobalLoading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuperReceitas - As receitas dos últimos cozinheiros da Terra",
  description: "Descubra, compartilhe e organize receitas ambelivibous",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <GlobalLoading />
        <Header />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  )
}
