import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import axios from 'axios';
// Importa la interfaz CONSISTENTE desde Home o defínela aquí igual
import type { CartItem } from './Home'; // O define la interfaz aquí si prefieres

// Define una interfaz para los datos del pedido que enviarás al backend
interface PedidoData {
    items: { producto: string; cantidad: number }[]; // producto es el _id
    total: number;
    metodoPago: string;
    estado?: string;
    cliente?: { nombre: string }; // Ajusta según necesites
    // Agrega otros campos si tu modelo de backend los requiere
}

const Checkout: React.FC = () => {
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Carga el carrito desde localStorage usando la clave correcta 'carrito'
        const carritoGuardado = localStorage.getItem('carrito');
        console.log("Carrito guardado en localStorage:", carritoGuardado); // <-- Añade esto para depurar
        try {
            const itemsCarrito: CartItem[] = carritoGuardado ? JSON.parse(carritoGuardado) : [];
             console.log("Carrito parseado:", itemsCarrito); // <-- Añade esto para depurar
            if (!Array.isArray(itemsCarrito)) {
                console.error("Error: El carrito recuperado no es un array.");
                setCarrito([]); // Asegura que carrito sea un array vacío si hay error
            } else {
                 setCarrito(itemsCarrito);
                 // Calcula el total DESPUÉS de establecer el carrito
                 const totalCalculado = itemsCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
                 setTotal(totalCalculado);
            }

        } catch (error) {
            console.error("Error al parsear el carrito desde localStorage:", error);
            setCarrito([]); // En caso de error de parseo, carrito vacío
            setTotal(0);
        }
    }, []); // Se ejecuta solo una vez al montar

    const handlePayment = async (metodo: string) => {
        if (carrito.length === 0) {
            alert("El carrito está vacío. No se puede proceder al pago.");
            return;
        }

        const pedidoData: PedidoData = {
            items: carrito.map(item => ({
                producto: item._id, // Usamos _id que es consistente ahora
                cantidad: item.cantidad,
            })),
            total: total,
            metodoPago: metodo,
            estado: 'Pendiente',
            cliente: { nombre: 'Cliente Temporal' } // Ajustar si tienes datos del cliente
        };

        try {
            const response = await axios.post('http://localhost:5000/api/pedidos', pedidoData);
            console.log('Pedido creado:', response.data);

            localStorage.removeItem('carrito'); // Limpia carrito DESPUÉS del éxito
            setCarrito([]); // Actualiza estado local
            setTotal(0);

            alert('¡Pedido realizado con éxito!');

            // Redirige según el método o a una página de confirmación
            if (metodo === 'Efectivo') {
                 navigate('/pago-efectivo');
            } else if (metodo === 'Tarjeta') {
                 navigate('/pago-tarjeta');
            } else if (metodo === 'MercadoPago') {
                 navigate('/pago-mercadopago');
            } else {
                 navigate('/confirmacion-pedido');
            }

        } catch (error) {
            console.error("Error al crear el pedido:", error);
            if (axios.isAxiosError(error)) {
                alert(`Error al realizar el pedido: ${error.response?.data?.message || error.message}`);
            } else {
                alert('Ocurrió un error inesperado al realizar el pedido.');
            }
        }
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl mb-4">Resumen del Pedido</h2>
                {carrito.length > 0 ? (
                    carrito.map((item) => (
                        <div key={item._id} className="flex justify-between items-center mb-2">
                             {/* Mostramos nombre y cantidad */}
                            <span>{item.nombre} x {item.cantidad}</span>
                            {/* Calculamos subtotal */}
                            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                    ))
                ) : (
                    <p>El carrito está vacío.</p> // Mensaje si no hay items
                )}
                <hr className="my-4" />
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span> {/* Mostramos el total calculado */}
                </div>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h2 className="text-xl mb-4">Método de Pago</h2>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                   <Button
                        onClick={() => handlePayment('Efectivo')}
                        className="w-full md:w-auto"
                        disabled={carrito.length === 0} // Deshabilita si el carrito está vacío
                    >
                        Pagar en Efectivo
                    </Button>
                    <Button
                        onClick={() => handlePayment('Tarjeta')}
                        className="w-full md:w-auto"
                        disabled={carrito.length === 0} // Deshabilita si el carrito está vacío
                    >
                        Pagar con Tarjeta
                    </Button>
                    <Button
                        onClick={() => handlePayment('MercadoPago')}
                        className="w-full md:w-auto"
                         disabled={carrito.length === 0} // Deshabilita si el carrito está vacío
                    >
                        Pagar con MercadoPago
                    </Button>
                </div>
                 {/* Aquí podrías añadir los componentes específicos para Tarjeta o MercadoPago si fuera necesario */}
            </div>
        </div>
    );
};

export default Checkout;