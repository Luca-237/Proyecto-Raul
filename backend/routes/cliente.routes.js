import express from 'express';
import { 
  validarClientePorTelefono, 
  obtenerTodosLosClientes, 
  obtenerClientePorId, 
  crearNuevoCliente 
} from '../controllers/cliente.controller.js';

const router = express.Router();

// POST /api/clientes/validar-telefono - Validar cliente por teléfono
router.post('/validar-telefono', validarClientePorTelefono);

// GET /api/clientes - Obtener todos los clientes
router.get('/', obtenerTodosLosClientes);

// GET /api/clientes/:id - Obtener cliente por ID
router.get('/:id', obtenerClientePorId);

// POST /api/clientes - Crear nuevo cliente
router.post('/', crearNuevoCliente);

export default router;
