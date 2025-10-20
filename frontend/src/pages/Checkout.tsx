// =============================================================================
// src/pages/Checkout.tsx - REDISEÑADO
// =============================================================================

import { ShoppingCart, CreditCard, DollarSign, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Product } from "@/components/ui/productList"

// ===== INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

interface CheckoutProps {
  carritoItems: CartItem[]
  totalCarrito: number
  onBack: () => void
  onUpdateCantidad: (productoId: number, nuevaCantidad: number) => void
  onRemoveItem: (productoId: number) => void
  onSelectPaymentMethod: (method: 'cash' | 'card') => void;
}

// ===== COMPONENTE CHECKOUT =====
export default function Checkout({ carritoItems, totalCarrito, onBack, onUpdateCantidad, onRemoveItem, onSelectPaymentMethod }: CheckoutProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <Button variant="outline" size="lg" onClick={onBack} className="text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Resumen del Pedido */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
              <ShoppingCart className="h-7 w-7 mr-3 text-red-600" />
              Tu Pedido
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3">
              {carritoItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-lg text-gray-800">{item.name}</p>
                    <p className="text-gray-500 font-medium">{item.price} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg text-center w-8">{item.cantidad}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-dashed pt-6 mt-6">
              <div className="flex justify-between items-center font-extrabold text-2xl text-gray-800">
                <span>Total:</span>
                <span>${totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">¿Cómo quieres pagar?</h2>
            <div className="space-y-6">
              <Button variant="outline" className="w-full justify-center items-center text-left h-24 p-6 border-2 hover:border-red-500 hover:bg-red-50" onClick={() => onSelectPaymentMethod('card')}>
                <CreditCard className="h-10 w-10 mr-6 text-gray-700" />
                <span className="text-xl font-bold text-gray-800">Tarjeta de Crédito / Débito</span>
              </Button>
              <Button variant="outline" className="w-full justify-center items-center text-left h-24 p-6 border-2 hover:border-red-500 hover:bg-red-50" onClick={() => onSelectPaymentMethod('cash')}>
                <DollarSign className="h-10 w-10 mr-6 text-gray-700" />
                <span className="text-xl font-bold text-gray-800">Pagar en Caja</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}