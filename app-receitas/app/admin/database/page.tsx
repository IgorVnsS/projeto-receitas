"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Database, RefreshCw, Loader2, Check, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null)

  const runSeedScript = async () => {
    if (!confirm("Tem certeza que deseja executar o script de seed? Isso irá substituir todos os dados existentes.")) {
      return
    }

    setIsSeeding(true)
    setSeedResult(null)

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao executar script de seed")
      }

      const data = await response.json()
      setSeedResult({
        success: true,
        message: data.message,
      })
    } catch (error) {
      setSeedResult({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banco de Dados</h1>
          <p className="text-gray-600">Execute operações no banco de dados</p>
        </div>
        <Link href="/admin">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-orange-500" />
              Seed do Banco de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Execute o script de seed para popular o banco de dados com categorias e receitas de exemplo.
              <span className="font-bold text-red-600"> Atenção: isso irá substituir todos os dados existentes!</span>
            </p>

            {seedResult && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  seedResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {seedResult.success ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium ${seedResult.success ? "text-green-800" : "text-red-800"}`}>
                      {seedResult.success ? "Operação concluída com sucesso" : "Erro na operação"}
                    </h3>
                    <p className={seedResult.success ? "text-green-700" : "text-red-700"}>{seedResult.message}</p>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={runSeedScript} disabled={isSeeding} className="bg-orange-500 hover:bg-orange-600">
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Script de Seed
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
