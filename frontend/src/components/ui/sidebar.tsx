// =============================================================================
// src/components/ui/sidebar.tsx - REDISEÑADO
// =============================================================================

import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo_mcraulo.svg';

const SideBar = () => {
  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col p-4 shadow-md">
      <div className="flex items-center justify-center my-6">
        <img src={Logo} alt="McRaulo Logo" className="w-32" />
      </div>
      <nav className="flex flex-col space-y-2">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start text-lg py-6 hover:bg-red-50 focus:bg-red-100 text-gray-700">
            <Home className="mr-3 h-6 w-6" />
            Inicio
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="w-full justify-start text-lg py-6 hover:bg-red-50 focus:bg-red-100 text-gray-700">
            Login
          </Button>
        </Link>
        <Link to="/admin">
          <Button variant="ghost" className="w-full justify-start text-lg py-6 text-yellow-500 hover:bg-yellow-50 focus:bg-yellow-100 hover:text-yellow-600">
            Administración
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default SideBar;