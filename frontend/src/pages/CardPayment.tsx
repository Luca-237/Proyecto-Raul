// =============================================================================
// src/pages/CardPayment.tsx - NUEVO ARCHIVO
// =============================================================================

import { ArrowLeft, ArrowDown, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

// ===== INTERFACES =====
interface CardPaymentProps {
  onBack: () => void
}

// ===== COMPONENTE PAGO CON TARJETA =====
export default function CardPayment({ onBack }: CardPaymentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pago con Tarjeta</h1>
              <p className="text-sm text-gray-500">Sigue las instrucciones en el lector de tarjetas</p>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">

          <CreditCard className="mx-auto h-16 w-16 text-blue-500 mb-6" />

          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Por favor, inserte o deslice su tarjeta
          </h2>

          <div className="animate-bounce">
            <ArrowDown className="mx-auto h-12 w-12 text-blue-600" />
          </div>

          <div className="mt-4 p-4 bg-gray-700 rounded-lg w-3/4 mx-auto">
            <div className="h-2 bg-gray-800 rounded w-full"></div>
          </div>
           <p className="text-xs text-gray-400 mt-2">Lector de tarjetas</p>

        </div>
      </main>
    </div>
  )
}