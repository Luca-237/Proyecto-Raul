// =============================================================================
// src/pages/Home.tsx - CORREGIDO (Error de imagen)
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

  const totalCarrito = carritoItems.reduce((total, item) => {
    const precio = parseFloat(item.price.replace('$', ''));
    return total + (precio * item.cantidad);
  }, 0);

  const MainContent = () => {
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
        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {selectedCategory === "todas" ? "Elige tu pedido" : 
                       selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon"><User className="h-6 w-6 text-gray-600" /></Button>
                    <Button variant="ghost" size="icon"><Settings className="h-6 w-6 text-gray-600" /></Button>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 mb-32">
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
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <MainContent />

      {checkoutStep === 'products' && carritoItems.length > 0 && (
        <footer className="fixed bottom-0 left-64 right-0 bg-white border-t-4 border-yellow-400 shadow-2xl p-4 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-x-auto pr-4">
              {carritoItems.map(item => (
                <div key={item.id} className="flex-shrink-0 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {/* ✅ CORRECCIÓN: Comprueba si existe la imagen antes de mostrarla */}
                  <img 
                    src={item.image ? `http://localhost:3000/${item.image.replace(/\\/g, '/')}` : 'https://via.placeholder.com/150'} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-md" 
                  />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleUpdateCantidad(item.id, item.cantidad - 1)}>
                         <Minus className="h-3 w-3" />
                       </Button>
                       <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                       <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleUpdateCantidad(item.id, item.cantidad + 1)}>
                         <Plus className="h-3 w-3" />
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 ml-6">
              <div className="text-right">
                <p className="text-gray-600 font-medium">Total del Pedido</p>
                <p className="font-extrabold text-3xl text-gray-800">${totalCarrito.toFixed(2)}</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white h-16 px-8 rounded-lg text-lg font-bold" onClick={() => setCheckoutStep('checkout')}>
                <ShoppingCart className="h-6 w-6 mr-3" />
                Pagar Ahora
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}