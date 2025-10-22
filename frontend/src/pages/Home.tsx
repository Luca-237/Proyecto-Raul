import React, { useState, useEffect } from 'react';
import ProductList from '@/components/ui/productList';
import Sidebar from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Product as Producto } from '@/components/ui/productList';

// Define la interfaz para los items del carrito CONSISTENTE
export interface CartItem {
  _id: string; // Usar _id consistentemente
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string; // Opcional, si la tienes
  // Agrega otras propiedades si existen en tu objeto Producto
}

const Home: React.FC = () => {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos');
  const navigate = useNavigate();

  useEffect(() => {
    // Carga el carrito desde localStorage al iniciar
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const parsed = JSON.parse(carritoGuardado);
        if (Array.isArray(parsed)) setCarrito(parsed);
      } catch (err) {
        console.error('Error parseando carrito desde localStorage', err);
      }
    }
  }, []);

  // Guarda el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const addToCart = (producto: Producto) => {
    // Producto viene de ProductList y tiene la interfaz 'Producto' (id, name, price...)
    setCarrito(prevCarrito => {
      const idStr = String(producto.id);
      const itemExistente = prevCarrito.find(item => item._id === idStr);
      const precioNum = typeof producto.price === 'string' ? parseFloat(producto.price.replace(/[^0-9.-]+/g, '')) || 0 : (producto.price as unknown as number) || 0;

      if (itemExistente) {
        return prevCarrito.map(item => item._id === idStr ? { ...item, cantidad: item.cantidad + 1 } : item);
      }

      const nuevoItem: CartItem = {
        _id: idStr,
        nombre: producto.name,
        precio: precioNum,
        cantidad: 1,
        imagen: (producto as any).imageSrc || undefined,
      };

      return [...prevCarrito, nuevoItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item._id === productId);
      if (itemExistente && itemExistente.cantidad > 1) {
        // Si hay más de uno, decrementa la cantidad
        return prevCarrito.map(item =>
          item._id === productId ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      } else {
        // Si hay solo uno o no existe (aunque no debería pasar), elimínalo
        return prevCarrito.filter(item => item._id !== productId);
      }
    });
  };

   const clearCart = () => {
    setCarrito([]);
    // localStorage se actualizará automáticamente por el useEffect [carrito]
  };

  const handleIrAlPago = () => {
    if (carrito.length > 0) {
      navigate('/checkout'); // Navega a la página de checkout
    } else {
      alert("El carrito está vacío."); // O muestra un mensaje más amigable
    }
  };


  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectCategory={setCategoriaSeleccionada} />
      <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        {/* Asegúrate que ProductList reciba addToCart y removeFromCart */}
        <ProductList
          categoria={categoriaSeleccionada}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          carrito={carrito}
         />
      </main>
      <aside className="w-64 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Carrito</h2>
        <div className="flex-1 overflow-y-auto mb-4">
          {carrito.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            carrito.map(item => (
              <div key={item._id} className="border-b py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-sm text-gray-600">${item.precio.toFixed(2)} x {item.cantidad}</p>
                </div>
                 <div className="flex items-center">
                    <Button size="sm" variant="outline" onClick={() => removeFromCart(item._id)}>-</Button>
                    <span className="mx-2">{item.cantidad}</span>
                    {/* Re-usa addToCart para incrementar la cantidad */}
                    <Button size="sm" variant="outline" onClick={() => addToCart({ id: Number(item._id), name: item.nombre, price: String(item.precio) } as any)}>+</Button>
                 </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-auto border-t pt-4">
           <div className="flex justify-between font-bold text-lg mb-4">
               <span>Total:</span>
               <span>${totalCarrito.toFixed(2)}</span>
           </div>
           <Button className="w-full mb-2" onClick={handleIrAlPago} disabled={carrito.length === 0}>
               Ir al Pago
           </Button>
           <Button className="w-full" variant="outline" onClick={clearCart} disabled={carrito.length === 0}>
               Vaciar Carrito
           </Button>
        </div>
      </aside>
    </div>
  );
};

export default Home;