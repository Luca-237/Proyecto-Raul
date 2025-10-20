// =============================================================================
// src/pages/CashPayment.tsx - SIMPLIFICADO SIN EXTRAS
// =============================================================================

import { ArrowLeft, ArrowDown, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Product } from "@/components/ui/productList"

// ===== INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

interface CashPaymentProps {
  carritoItems: CartItem[]
  totalCarrito: number
  onBack: () => void
}

// ===== COMPONENTE PAGO EN EFECTIVO =====
export default function CashPayment({ carritoItems, totalCarrito, onBack }: CashPaymentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">¡Gracias por tu pedido!</h1>
              <p className="text-sm text-gray-500">Tu ticket se está imprimiendo...</p>
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

          {/* Ticket */}
          <div className="border-dashed border-2 border-gray-300 p-6 mb-6">
            <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-4">McRaulo's</h2>
            <div className="space-y-2 text-left text-sm mb-4">
              {carritoItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.cantidad}x {item.name}</span>
                  <span>${(parseFloat(item.price.replace('$', '')) * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Instrucción */}
          <div className="animate-bounce">
            <ArrowDown className="mx-auto h-10 w-10 text-emerald-600" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-2">
            Retirar ticket y presentar en caja
          </p>

        </div>
      </main>
    </div>
  )
}