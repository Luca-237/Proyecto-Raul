// app.js
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
// import { testConnection } from './db/db.js';

// Importar rutas
import categoriaRoutes from './routes/categoria.routes.js';
import ingredienteRoutes from './routes/ingrediente.routes.js';
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedidos.routes.js';
import clienteRoutes from './routes/cliente.routes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api/categorias', categoriaRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/clientes', clienteRoutes);

// Middleware para manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});