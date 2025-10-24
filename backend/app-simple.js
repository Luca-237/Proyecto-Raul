// app.js simplificado para prueba
import cors from 'cors';
import express from 'express';
import clienteRoutes from './routes/cliente.routes.js';

const app = express();
const PORT = 3000;

// Middleware para entender JSON
app.use(express.json());
app.use(cors());

// Solo rutas de cliente para prueba
app.use('/api/clientes', clienteRoutes);

// Middleware para manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
