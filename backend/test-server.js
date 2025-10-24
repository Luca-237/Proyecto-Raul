import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Ruta de validación de teléfono
app.post('/api/clientes/validar-telefono', (req, res) => {
  const { telefono } = req.body;
  
  // Datos de prueba
  const clientes = [
    { idCliente: 1, nombre: 'Juan Pérez', telefono: '3511234567', puntos: 150 },
    { idCliente: 2, nombre: 'María González', telefono: '3517654321', puntos: 80 },
    { idCliente: 3, nombre: 'Carlos Rodríguez', telefono: '3519876543', puntos: 250 },
    { idCliente: 4, nombre: 'Ana López', telefono: '3512468135', puntos: 45 }
  ];
  
  const cliente = clientes.find(c => c.telefono === telefono);
  
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
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba escuchando en http://localhost:${PORT}`);
});
