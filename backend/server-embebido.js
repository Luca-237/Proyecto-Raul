import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Datos de clientes embebidos en el código
const clientesData = {
  clientes: [
    {
      idCliente: 1,
      nombre: 'Juan Pérez',
      usuario: 'juanp',
      correo: 'juan@email.com',
      telefono: '3511234567',
      puntos: 150
    },
    {
      idCliente: 2,
      nombre: 'María González',
      usuario: 'mariag',
      correo: 'maria@email.com',
      telefono: '3517654321',
      puntos: 80
    },
    {
      idCliente: 3,
      nombre: 'Carlos Rodríguez',
      usuario: 'carlosr',
      correo: 'carlos@email.com',
      telefono: '3519876543',
      puntos: 250
    },
    {
      idCliente: 4,
      nombre: 'Ana López',
      usuario: 'anal',
      correo: 'ana@email.com',
      telefono: '3512468135',
      puntos: 45
    }
  ]
};

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    mensaje: 'Servidor funcionando correctamente',
    clientes: clientesData.clientes.length,
    puerto: PORT
  });
});

// Ruta para obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  try {
    res.json(clientesData.clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer clientes' });
  }
});

// Ruta de validación de teléfono
app.post('/api/clientes/validar-telefono', (req, res) => {
  try {
    const { telefono } = req.body;
    
    if (!telefono) {
      return res.status(400).json({ 
        error: 'El número de teléfono es requerido' 
      });
    }
    
    const cliente = clientesData.clientes.find(c => c.telefono === telefono);
    
    if (cliente) {
      res.json({
        mensaje: 'Cliente encontrado',
        encontrado: true,
        cliente: cliente
      });
    } else {
      res.status(404).json({
        error: 'Usuario no encontrado',
        encontrado: false
      });
    }
  } catch (error) {
    console.error('Error en validar-telefono:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor JSON embebido escuchando en http://localhost:${PORT}`);
  console.log(`📋 Clientes disponibles: ${clientesData.clientes.length}`);
  console.log(`📱 Teléfonos de prueba:`);
  clientesData.clientes.forEach(cliente => {
    console.log(`   - ${cliente.telefono} (${cliente.nombre})`);
  });
});
