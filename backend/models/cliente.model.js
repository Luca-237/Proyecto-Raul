import fs from 'fs';
import path from 'path';

// Ruta al archivo JSON de clientes
const clientesFilePath = path.join(process.cwd(), 'data', 'clientes.json');

// Función para leer el archivo JSON
const leerClientes = () => {
  try {
    const data = fs.readFileSync(clientesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de clientes:', error);
    return { clientes: [] };
  }
};

// Función para escribir el archivo JSON
const escribirClientes = (data) => {
  try {
    fs.writeFileSync(clientesFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al escribir el archivo de clientes:', error);
    return false;
  }
};

// Función para buscar cliente por teléfono
export const buscarClientePorTelefono = async (telefono) => {
  try {
    const data = leerClientes();
    const cliente = data.clientes.filter(c => c.telefono === telefono);
    
    return cliente;
  } catch (err) {
    console.error('Error en buscarClientePorTelefono:', err);
    throw err;
  }
};

// Función para obtener todos los clientes
export const getAllClientes = async () => {
  try {
    const data = leerClientes();
    return data.clientes;
  } catch (err) {
    console.error('Error en getAllClientes:', err);
    throw err;
  }
};

// Función para obtener cliente por ID
export const getClienteById = async (id) => {
  try {
    const data = leerClientes();
    const cliente = data.clientes.filter(c => c.idCliente === parseInt(id));
    return cliente;
  } catch (err) {
    console.error('Error en getClienteById:', err);
    throw err;
  }
};

// Función para crear un nuevo cliente
export const crearCliente = async (clienteData) => {
  try {
    const { nombre, usuario, contraseña, correo, telefono, puntos = 0 } = clienteData;
    
    const data = leerClientes();
    const nuevoCliente = {
      idCliente: data.clientes.length + 1,
      nombre,
      usuario,
      correo,
      telefono,
      puntos
    };
    
    data.clientes.push(nuevoCliente);
    
    if (escribirClientes(data)) {
      return nuevoCliente;
    } else {
      throw new Error('Error al guardar el cliente');
    }
  } catch (err) {
    console.error('Error en crearCliente:', err);
    throw err;
  }
};
