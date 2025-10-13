// =============================================================================
// 🔧 SOLUCIÓN COMPLETA PARA ERRORES DE TYPESCRIPT
// =============================================================================

// ===== 1. ARREGLAR productList.tsx =====
// Reemplaza todo el contenido con este código tipado correctamente:

// src/components/ui/productList.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

// ===== TIPOS E INTERFACES =====
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export interface Product {
  id: number
  name: string
  href: string
  price: string
  imageSrc: string
  imageAlt: string
  category?: string
  descripcion?: string
  ingredientesBase?: any[]
}

interface ProductBackend {
  idproducto?: number
  idProducto?: number
  nombre: string
  precio: number
  categoria: string
  descripcion?: string
  ingredientesBase?: any[]
}

interface ProductListProps {
  onProductClick?: (product: Product) => void
  categoria?: string
  incluirIngredientes?: boolean
  titulo?: string
}

// ===== CONFIGURACIÓN API =====
const API_BASE_URL = 'http://localhost:3000/api'

// ===== FUNCIONES API CON TIPOS =====
const apiRequest = async (url: string, options: FetchOptions = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

const obtenerTodosLosProductos = async (incluirIngredientes = false): Promise<ProductBackend[]> => {
  const url = `${API_BASE_URL}/productos${incluirIngredientes ? '?incluirIngredientes=true' : ''}`
  return await apiRequest(url)
}

const obtenerProductosPorCategoria = async (
  categoria: string, 
  incluirIngredientes = false
): Promise<ProductBackend[]> => {
  const url = `${API_BASE_URL}/productos/categoria/${categoria}${incluirIngredientes ? '?incluirIngredientes=true' : ''}`
  return await apiRequest(url)
}

const obtenerImagenPorCategoria = (categoria: string, nombre: string): string => {
  const categoriaLower = categoria.toLowerCase()
  
  const imagenesCategoria: Record<string, string[]> = {
    hamburguesa: [
      "https://media.istockphoto.com/id/840902892/es/foto/hamburguesa-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=uQIMRE1GPy8nh_WiCmK70qg30fjUaxnStPLVR2KLJHU=",
      "https://media.istockphoto.com/id/1130865856/es/foto/hamburguesa-con-queso-y-carne.jpg?s=612x612&w=0&k=20&c=Crz1_qwd7RkTBrzP9mrIQbWxDr2j7oV7B4dFZAvSr-M=",
      "https://media.istockphoto.com/id/1315035442/es/foto/hamburguesa-de-garbanzos.jpg?s=612x612&w=0&k=20&c=O4oTwvVfRk0Po4b6ngCJST6sP9QyH1ef0PBR2KxLOtE=",
    ],
    papa: [
      "https://media.istockphoto.com/id/471748896/es/foto/papas-fritas.jpg?s=612x612&w=0&k=20&c=brnEhS2yPC2fTFzLhzK-5wPIL4bC0slO_mnqHWz31Rg=",
      "https://media.istockphoto.com/id/1213419557/es/foto/papas-fritas.jpg?s=612x612&w=0&k=20&c=lYFymMTDE8spD1aOGz1bgSRBql2MzyUmxYgUIv2aHtY=",
    ],
    bebida: [
      "https://media.istockphoto.com/id/458749181/es/foto/botella-de-coca-cola.jpg?s=612x612&w=0&k=20&c=Enn3NMTwOshvUomShESkQl9A69Lwo02HzfI15okDJfM=",
      "https://media.istockphoto.com/id/1402164564/es/foto/botella-de-agua.jpg?s=612x612&w=0&k=20&c=RwTEKHAgd1N0vT1u_YlU5Ql8pH5QGdJkAPln3NRfjO4=",
    ]
  }

  let imagenes: string[] = []
  for (const [key, urls] of Object.entries(imagenesCategoria)) {
    if (categoriaLower.includes(key)) {
      imagenes = urls
      break
    }
  }

  if (imagenes.length === 0) {
    imagenes = imagenesCategoria.hamburguesa
  }

  const index = Math.abs(nombre.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % imagenes.length
  return imagenes[index]
}

const transformarProductoBackend = (productoBackend: ProductBackend): Product => {
  return {
    id: productoBackend.idproducto || productoBackend.idProducto || 0,
    name: productoBackend.nombre,
    href: "#",
    price: `$${productoBackend.precio}`,
    category: productoBackend.categoria,
    imageSrc: obtenerImagenPorCategoria(productoBackend.categoria, productoBackend.nombre),
    imageAlt: `${productoBackend.nombre} - ${productoBackend.descripcion || productoBackend.categoria}`,
    descripcion: productoBackend.descripcion,
    ingredientesBase: productoBackend.ingredientesBase || []
  }
}

// ===== COMPONENTE PRINCIPAL =====
export default function ProductList({ 
  onProductClick, 
  categoria, 
  incluirIngredientes = false,
  titulo 
}: ProductListProps) {
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarProductos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let productosRaw: ProductBackend[]
      
      if (categoria) {
        console.log(`Cargando productos de categoría: ${categoria}`)
        productosRaw = await obtenerProductosPorCategoria(categoria, incluirIngredientes)
      } else {
        console.log('Cargando todos los productos')
        productosRaw = await obtenerTodosLosProductos(incluirIngredientes)
      }
      
      const productosTransformados = productosRaw.map(transformarProductoBackend)
      setProductos(productosTransformados)
      
      console.log(`✅ ${productosTransformados.length} productos cargados`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMsg)
      console.error('❌ Error cargando productos:', errorMsg)
      
      // Datos de fallback
      setProductos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [categoria, incluirIngredientes])

  const handleProductClick = (product: Product) => {
    console.log(`🔍 Producto clickeado:`, product)
    onProductClick?.(product)
  }

  const handleRetry = () => {
    console.log('🔄 Reintentando carga de productos...')
    cargarProductos()
  }

  if (loading) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Error al cargar productos</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRetry} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="w-full">
        {titulo && <h2 className="text-xl font-bold mb-4">{titulo}</h2>}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No hay productos disponibles</p>
          <Button onClick={handleRetry} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
      </div>
    )
  }

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
                  e.stopPropagation()
                  handleProductClick(product)
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
  )
}