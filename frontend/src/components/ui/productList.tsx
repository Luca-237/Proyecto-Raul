import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { obtenerProductos, obtenerProductosPorCategoria } from '../../../services/productosApi';

// ===== TIPOS E INTERFACES =====
export interface Product {
  id: number;
  name: string;
  href: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  category?: string;
  descripcion?: string;
  ingredientesBase?: any[];
}

interface ProductBackend {
  idproducto?: number;
  idProducto?: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  imagen_url?: string;
  ingredientesBase?: any[];
}

interface ProductListProps {
  onProductClick?: (product: Product) => void;
  categoria?: string;
  incluirIngredientes?: boolean;
  titulo?: string;
}

// ===== IMÁGENES POR DEFECTO =====
const obtenerImagenPorCategoria = (categoria: string, nombre: string, imagen_url?: string): string => {
  // Si el producto tiene imagen_url de Cloudinary, usarla
  if (imagen_url) {
    return imagen_url;
  }

  const categoriaLower = categoria.toLowerCase();
  
  const imagenesCategoria: Record<string, string[]> = {
    hamburguesa: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop",
    ],
    papa: [
      "https://images.unsplash.com/photo-1585238341710-4a0f4c3b8e3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
    ],
    bebida: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop",
    ],
    postre: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop",
    ],
    combo: [
      "https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop",
    ]
  };

  let imagenes: string[] = imagenesCategoria.hamburguesa;
  
  for (const [key, urls] of Object.entries(imagenesCategoria)) {
    if (categoriaLower.includes(key)) {
      imagenes = urls;
      break;
    }
  }

  const index = Math.abs(nombre.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % imagenes.length;
  return imagenes[index];
};

// ===== TRANSFORMAR DATOS DEL BACKEND =====
const transformarProductoBackend = (productoBackend: ProductBackend): Product => {
  const id = productoBackend.idproducto || productoBackend.idProducto || 0;
  const precio = typeof productoBackend.precio === 'number' 
    ? productoBackend.precio 
    : parseFloat(productoBackend.precio as any) || 0;

  return {
    id,
    name: productoBackend.nombre,
    href: `#producto-${id}`,
    price: `$${precio.toFixed(2)}`,
    category: productoBackend.categoria,
    imageSrc: obtenerImagenPorCategoria(
      productoBackend.categoria, 
      productoBackend.nombre,
      productoBackend.imagen_url
    ),
    imageAlt: `${productoBackend.nombre} - ${productoBackend.descripcion || productoBackend.categoria}`,
    descripcion: productoBackend.descripcion,
    ingredientesBase: productoBackend.ingredientesBase || []
  };
};

// ===== COMPONENTE PRINCIPAL =====
export default function ProductList({ 
  onProductClick, 
  categoria, 
  incluirIngredientes = false,
  titulo 
}: ProductListProps) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let productosRaw: ProductBackend[];
      
      if (categoria) {
        console.log(`📦 Cargando productos de categoría: ${categoria}`);
        productosRaw = await obtenerProductosPorCategoria(categoria);
      } else {
        console.log('📦 Cargando todos los productos');
        productosRaw = await obtenerProductos();
      }
      
      // Verificar si la respuesta es un array o tiene una estructura diferente
      if (!Array.isArray(productosRaw)) {
        console.warn('⚠️ La respuesta no es un array:', productosRaw);
        productosRaw = [];
      }
      
      const productosTransformados = productosRaw.map(transformarProductoBackend);
      setProductos(productosTransformados);
      
      console.log(`✅ ${productosTransformados.length} productos cargados exitosamente`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
      setError(errorMsg);
      console.error('❌ Error cargando productos:', err);
      
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [categoria, incluirIngredientes]);

  const handleProductClick = (product: Product) => {
    console.log(`🔍 Producto seleccionado:`, product);
    onProductClick?.(product);
  };

  const handleRetry = () => {
    console.log('🔄 Reintentando carga de productos...');
    cargarProductos();
  };

  // ===== ESTADO: CARGANDO =====
  if (loading) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // ===== ESTADO: ERROR =====
  if (error) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Error al cargar productos</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="mt-4 space-y-2">
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
              <p className="text-xs text-muted-foreground">
                Verifica que el backend esté corriendo en http://localhost:3000
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ESTADO: SIN PRODUCTOS =====
  if (productos.length === 0) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-lg font-medium">No hay productos disponibles</p>
          <p className="text-sm text-muted-foreground">
            {categoria 
              ? `No se encontraron productos en la categoría "${categoria}"` 
              : 'Aún no hay productos en el catálogo'}
          </p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
      </div>
    );
  }

  // ===== ESTADO: PRODUCTOS CARGADOS =====
  return (
    <div className="w-full">
      {titulo && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{titulo}</h2>
          <div className="text-sm text-muted-foreground">
            {productos.length} producto{productos.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productos.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer group overflow-hidden border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback si la imagen falla al cargar
                  (e.target as HTMLImageElement).src = 
                    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop';
                }}
              />
              {product.category && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-1">
                    {product.name}
                  </h3>
                  {product.descripcion && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {product.descripcion}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">{product.price}</p>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full h-8 text-xs font-medium bg-emerald-700 hover:bg-emerald-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}