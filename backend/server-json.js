import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Ruta al archivo JSON de clientes
const clientesFilePath = path.join(process.cwd(), 'data', 'clientes.json');

// Función para leer clientes del JSON
const leerClientes = () => {
  try {
    const data = fs.readFileSync(clientesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer clientes:', error);
    return { clientes: [] };
  }
};

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    mensaje: 'Servidor funcionando correctamente',
    archivo: clientesFilePath,
    existe: fs.existsSync(clientesFilePath)
  });
});

// Ruta para obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  try {
    const data = leerClientes();
    res.json(data.clientes);
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
    
    const data = leerClientes();
    const cliente = data.clientes.find(c => c.telefono === telefono);
    
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
  console.log(`🚀 Servidor JSON escuchando en http://localhost:${PORT}`);
  console.log(`📁 Archivo de clientes: ${clientesFilePath}`);
  console.log(`📋 Clientes disponibles: ${leerClientes().clientes.length}`);
});
