// =============================================================================
// src/components/ui/sidebar.tsx - REDISEÑADO
// =============================================================================

import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo_mcraulo.svg';
import { useEffect, useState } from 'react';

interface SideBarProps {
  onSelectCategory?: (categoria: string) => void;
}

const SideBar = ({ onSelectCategory }: SideBarProps) => {
  const [categorias, setCategorias] = useState<Array<{ idtipoproducto: number; categoria: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        if (!res.ok) throw new Error('No se pudieron cargar las categorías');
        const data = await res.json();
        const cats = Array.isArray(data) ? data : (data && Array.isArray(data.categorias) ? data.categorias : []);
        setCategorias(cats);
      } catch (err) {
        console.error('Error cargando categorías en Sidebar:', err);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleSelect = (categoria?: string) => {
    const normalized = categoria ? categoria.trim().toLowerCase() : 'todos';
    onSelectCategory?.(normalized);
  };

  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col p-4 shadow-md">
      <div className="flex items-center justify-center my-6">
        <img src={Logo} alt="McRaulo Logo" className="w-32" />
      </div>
      <nav className="flex flex-col space-y-2">
        <Button variant="ghost" className="w-full justify-start text-lg py-4 hover:bg-red-50 focus:bg-red-100 text-gray-700" onClick={() => handleSelect('todos')}>
          <Home className="mr-3 h-6 w-6" />
          Todas
        </Button>

        {loading ? (
          <div className="px-2 py-4 text-sm text-gray-500">Cargando categorías...</div>
        ) : (
          categorias.map(cat => (
            <Button
              key={cat.idtipoproducto}
              variant="ghost"
              className="w-full justify-start text-sm py-2 hover:bg-gray-50"
              onClick={() => handleSelect(cat.categoria)}
            >
              {cat.categoria}
            </Button>
          ))
        )}

        <div className="mt-4">
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start text-lg py-4 hover:bg-red-50 focus:bg-red-100 text-gray-700">
              Login
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start text-lg py-4 text-yellow-500 hover:bg-yellow-50 focus:bg-yellow-100 hover:text-yellow-600">
              Administración
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;