// =============================================================================
// src/pages/Home.tsx - CORREGIDO
// =============================================================================

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Settings } from "lucide-react"
// ✅ IMPORTANTE: Usar SideBar con S mayúscula (debe coincidir con el nombre del archivo)
import SideBar from "@/components/ui/sidebar"
import ProductList, { type Product } from "@/components/ui/productList"

// ===== INTERFACES =====
interface CartItem extends Product {
  cantidad: number
}

// ===== COMPONENTE PRINCIPAL =====
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [carritoItems, setCarritoItems] = useState<CartItem[]>([])
  //const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null)

  // Manejar click en producto
  const handleProductClick = (producto: Product) => {
    console.log("Producto seleccionado:", producto)
   // setProductoSeleccionado(producto)
    agregarAlCarrito(producto)
  }

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Product) => {
    setCarritoItems(prev => {
      const itemExistente = prev.find(item => item.id === producto.id)
      
      if (itemExistente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      } else {
        return [...prev, { ...producto, cantidad: 1 }]
      }
    })
  }

  // Calcular total del carrito
  const totalCarrito = carritoItems.reduce((total, item) => {
    const precio = parseFloat(item.price.replace('$', ''))
    return total + (precio * item.cantidad)
  }, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "todas" ? "Todos los Productos" : 
                   selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                </h1>
                <p className="text-sm text-gray-500">
                  Selecciona tus productos favoritos
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Carrito */}
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {carritoItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {carritoItems.length}
                    </span>
                  )}
                  <span className="ml-2 hidden sm:inline">${totalCarrito.toFixed(2)}</span>
                </Button>
                
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Scrolleable */}
        <main className="flex-1 overflow-y-auto p-6">
          <ProductList
            onProductClick={handleProductClick}
            categoria={selectedCategory === "todas" ? undefined : selectedCategory}
            incluirIngredientes={false}
          />
        </main>
      </div>

      {/* Panel lateral del carrito (opcional) */}
      {carritoItems.length > 0 && (
        <aside className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Mi Pedido ({carritoItems.length})
          </h3>
          
          <div className="space-y-3 mb-6">
            {carritoItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>${totalCarrito.toFixed(2)}</span>
            </div>
            
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Proceder al Pago
            </Button>
          </div>
        </aside>
      )}
    </div>
  )
}