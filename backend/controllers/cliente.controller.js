import { buscarClientePorTelefono, getAllClientes, getClienteById, crearCliente } from '../models/cliente.model.js';

// Validar cliente por teléfono
export const validarClientePorTelefono = async (req, res) => {
  try {
    const { telefono } = req.body;
    
    // Validación básica
    if (!telefono) {
      return res.status(400).json({ 
        error: 'El número de teléfono es requerido' 
      });
    }
    
    // Buscar cliente por teléfono
    const cliente = await buscarClientePorTelefono(telefono);
    
    if (cliente.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        encontrado: false 
      });
    }
    
    // Cliente encontrado
    res.json({
      mensaje: 'Cliente encontrado',
      encontrado: true,
      cliente: cliente[0]
    });
    
  } catch (err) {
    console.error('Error en validarClientePorTelefono:', err);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: err.message 
    });
  }
};

// Obtener todos los clientes
export const obtenerTodosLosClientes = async (req, res) => {
  try {
    const clientes = await getAllClientes();
    res.json(clientes);
  } catch (err) {
    console.error('Error en obtenerTodosLosClientes:', err);
    res.status(500).json({ 
      error: 'Error al obtener clientes',
      detalle: err.message 
    });
  }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de cliente inválido' });
    }
    
    const cliente = await getClienteById(id);
    
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(cliente[0]);
  } catch (err) {
    console.error('Error en obtenerClientePorId:', err);
    res.status(500).json({ 
      error: 'Error al obtener cliente',
      detalle: err.message 
    });
  }
};

// Crear nuevo cliente
export const crearNuevoCliente = async (req, res) => {
  try {
    const { nombre, usuario, contraseña, correo, telefono, puntos = 0 } = req.body;
    
    // Validaciones básicas
    if (!nombre || !usuario || !contraseña || !correo || !telefono) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos: nombre, usuario, contraseña, correo, telefono' 
      });
    }
    
    const nuevoCliente = await crearCliente({
      nombre,
      usuario,
      contraseña,
      correo,
      telefono,
      puntos
    });
    
    res.status(201).json({
      mensaje: 'Cliente creado exitosamente',
      cliente: nuevoCliente
    });
    
  } catch (err) {
    console.error('Error en crearNuevoCliente:', err);
    
    // Manejo de errores específicos de PostgreSQL
    if (err.code === '23505') { // Violación de restricción única
      return res.status(400).json({ 
        error: 'Ya existe un cliente con ese usuario o correo',
        detalle: err.detail 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: err.message 
    });
  }
};
