import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import AdminPage from "./pages/AdminPage"; // Importamos la nueva página
import Sidebar from "./components/ui/sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} /> {/* Nueva Ruta */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;