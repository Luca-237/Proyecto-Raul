import express from 'express';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  calcularPrecioPersonalizado
} from '../controllers/producto.controller.js';
import upload from '../utils/multer.js'; // <--- IMPORTA MULTER
const router = express.Router();

// ===== RUTAS DE PRODUCTOS =====
router.get('/', getProductos);
// Usamos el middleware 'upload.single('imagen')'
// 'imagen' es el nombre del campo en el formulario del frontend
router.post('/', upload.single('imagen'), createProducto); // <--- MODIFICA ESTA LÍNEA

// 1. GET /api/productos - Obtener todos los productos
router.get('/', obtenerTodosLosProductos);

// 3. GET /api/productos/categoria/:categoria - Productos por categoría (debe ir antes que /:id)
router.get('/categoria/:categoria', obtenerProductosPorCategoria);

// 2. GET /api/productos/:id - Producto específico con ingredientes base
router.get('/:id', obtenerProductoPorId);

// 4. POST /api/productos/:id/calcular-precio - Calcular precio personalizado (NUEVO)
router.post('/:id/calcular-precio', calcularPrecioPersonalizado);

export default router;