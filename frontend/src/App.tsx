import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import SideBar from "@/components/ui/sidebar";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* Ruta de login sin sidebar */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas con sidebar */}
        <Route path="/*" element={
          <>
            <SideBar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;