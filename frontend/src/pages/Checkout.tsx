// =============================================================================
// src/pages/Checkout.tsx - SIMPLIFICADO SIN EXTRAS
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Confirmar Pedido</h1>
              <p className="text-sm text-gray-500">Revisa tu pedido y selecciona un método de pago</p>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la tienda
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Resumen del Pedido */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Resumen de tu Pedido
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {carritoItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.price} c/u</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-bold text-center w-5">{item.cantidad}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Seleccionar Método de Pago</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start items-center text-left h-auto p-4" onClick={() => onSelectPaymentMethod('card')}>
                <CreditCard className="h-6 w-6 mr-4 flex-shrink-0 text-blue-500" />
                <div>
                  <p className="font-medium">Tarjeta de Crédito/Débito</p>
                  <p className="text-xs text-gray-500">Paga de forma segura con tu tarjeta.</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start items-center text-left h-auto p-4" onClick={() => onSelectPaymentMethod('cash')}>
                <DollarSign className="h-6 w-6 mr-4 flex-shrink-0 text-emerald-500" />
                <div>
                  <p className="font-medium">Efectivo</p>
                  <p className="text-xs text-gray-500">Paga en efectivo al momento de la entrega.</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}