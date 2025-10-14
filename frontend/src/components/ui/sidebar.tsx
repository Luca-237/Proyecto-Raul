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

import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import Logo from '../../assets/logo_mcraulo.svg';

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="flex items-center justify-center mb-10">
        <img src={Logo} alt="McRaulo Logo" className="w-32" />
      </div>
      <nav className="flex flex-col space-y-4">
        {/* Usamos Link en lugar de <a> para la navegación interna */}
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start">
            Inicio
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="w-full justify-start">
            Login
          </Button>
        </Link>
        {/* --- ENLACE A LA PÁGINA DE ADMINISTRACIÓN --- */}
        <Link to="/admin">
          <Button variant="ghost" className="w-full justify-start text-yellow-400">
            Administración
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default SideBar;