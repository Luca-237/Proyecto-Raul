// =============================================================================
// 🔧 SOLUCIÓN - ARCHIVOS CORREGIDOS SIN VARIABLES NO USADAS
// =============================================================================

// ===== 1. ARREGLAR: src/components/ui/sidebar.tsx =====
// Reemplaza TODO el contenido con esto:

import { Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
}

interface SideBarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories: Category[] = [
  { id: "todas", name: "Todas", icon: <Home className="h-4 w-4" /> },
  { id: "hamburguesas", name: "Hamburguesas", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "papas", name: "Papas", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "bebidas", name: "Bebidas", icon: <ShoppingBag className="h-4 w-4" /> },
]

export function SideBar({ activeCategory, onCategoryChange }: SideBarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">🍔 Menú</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Categorías</p>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`w-full justify-start mb-1 ${
                activeCategory === category.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">© 2024 Mi Restaurante</p>
      </div>
    </aside>
  )
}

export default SideBar