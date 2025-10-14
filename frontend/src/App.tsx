import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import { Sidebar } from "@/components/ui/sidebar";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    // Se corrigieron las rutas de importación para usar el alias "@"
    // configurado en el proyecto, lo que soluciona los errores de compilación.
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
