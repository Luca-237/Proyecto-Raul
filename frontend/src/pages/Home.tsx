// =============================================================================
// src/pages/Home.tsx - CORREGIDO (SIN SIDEBAR DUPLICADO Y CON IMÁGENES)
// =============================================================================

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Settings, Minus, Plus } from "lucide-react"
import SideBar from "@/components/ui/sidebar"
import ProductList, { type Product } from "@/components/ui/productList"
import Checkout from "./Checkout"
import CashPayment from "./CashPayment"
import CardPayment from "./CardPayment"

// ===== INTERFACES =====
interface CartItem extends Product {
  cantidad: number;
}

type CheckoutStep = 'products' | 'checkout' | 'cash' | 'card';

// ===== COMPONENTE PRINCIPAL =====
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [carritoItems, setCarritoItems] = useState<CartItem[]>([])
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('products');

  // Agregar producto directamente al carrito al hacer clic
  const handleProductClick = (producto: Product) => {
    setCarritoItems(prev => {
      const itemExistente = prev.find(item => item.id === producto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Actualizar la cantidad de un producto
  const handleUpdateCantidad = (productoId: number, nuevaCantidad: number) => {
    setCarritoItems(prev => {
      if (nuevaCantidad <= 0) {
        return prev.filter(item => item.id !== productoId);
      }
      return prev.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );
    });
  };

  // Calcular total del carrito
  const totalCarrito = carritoItems.reduce((total, item) => {
    const precio = parseFloat(item.price.replace('$', ''));
    return total + (precio * item.cantidad);
  }, 0);

  // Renderizar contenido principal o pantallas de pago
  const renderContent = () => {
    switch (checkoutStep) {
      case 'checkout':
        return (
          <Checkout
            carritoItems={carritoItems}
            totalCarrito={totalCarrito}
            onBack={() => setCheckoutStep('products')}
            onUpdateCantidad={handleUpdateCantidad}
            onRemoveItem={(productoId) => setCarritoItems(prev => prev.filter(item => item.id !== productoId))}
            onSelectPaymentMethod={(method) => setCheckoutStep(method)}
          />
        );
      case 'cash':
        return (
          <CashPayment 
            carritoItems={carritoItems}
            totalCarrito={totalCarrito}
            onBack={() => setCheckoutStep('checkout')}
          />
        );
      case 'card':
        return (
          <CardPayment 
            onBack={() => setCheckoutStep('checkout')}
          />
        );
      case 'products':
      default:
        // ✅ CORRECCIÓN: Se quita el <SideBar /> de aquí para evitar duplicados
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm border-b">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedCategory === "todas" ? "Todos los Productos" : 
                       selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </h1>
                    <p className="text-sm text-gray-500">Selecciona tus productos favoritos</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm"><User className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 mb-24">
              <ProductList
                onProductClick={handleProductClick}
                categoria={selectedCategory === "todas" ? undefined : selectedCategory}
                incluirIngredientes={false}
              />
            </main>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* El Sidebar ahora solo se renderiza aquí una vez */}
      <SideBar />
      {renderContent()}

      {/* Footer del Pedido */}
      {checkoutStep === 'products' && carritoItems.length > 0 && (
        <footer className="fixed bottom-0 left-64 right-0 bg-white border-t-2 border-gray-200 shadow-lg p-4 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-x-auto">
              {carritoItems.map(item => (
                <div key={item.id} className="flex-shrink-0 flex items-center gap-3 p-2 border rounded-md">
                  {/* ✅ CORRECCIÓN: Se agrega la URL base para que las imágenes se muestren */}
                  <img src={`http://localhost:3000/${item.image}`} alt={item.name} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateCantidad(item.id, item.cantidad - 1)}>
                         <Minus className="h-3 w-3" />
                       </Button>
                       <span className="text-sm font-bold">{item.cantidad}</span>
                       <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateCantidad(item.id, item.cantidad + 1)}>
                         <Plus className="h-3 w-3" />
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 ml-4">
              <div className="text-right">
                <p className="text-gray-600">Total</p>
                <p className="font-bold text-xl">${totalCarrito.toFixed(2)}</p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6" onClick={() => setCheckoutStep('checkout')}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Proceder al Pago
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}