/**
 * @file Este archivo centraliza todas las llamadas a la API relacionadas con los productos.
 */

// Define la URL base de tu API. Asegúrate de que coincida con el puerto de tu backend.
const API_URL = 'http://localhost:3000/api';

/**
 * Obtiene todos los productos del backend.
 * @returns {Promise<Array<object>>} Una promesa que resuelve a un array de productos.
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
      // Si la respuesta no es exitosa, lanza un error con el estado.
      throw new Error(`Error HTTP ${response.status}: No se pudieron obtener los productos.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerProductos:', error);
    // Re-lanza el error para que el componente que llama (ej. HomePage) pueda manejarlo.
    throw error;
  }
};

/**
 * Crea un nuevo producto en el backend.
 * Esta función está diseñada para manejar 'multipart/form-data', lo que permite subir archivos.
 * @param {FormData} formData - El objeto FormData que contiene los datos del nuevo producto, incluida la imagen.
 * @returns {Promise<object>} Una promesa que resuelve al objeto del producto recién creado.
 */
export const crearNuevoProducto = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      body: formData,
      // ¡Importante! No establezcas el header 'Content-Type'.
      // El navegador lo hará automáticamente con el 'boundary' correcto para FormData.
    });

    if (!response.ok) {
      // Intenta obtener más detalles del error desde el cuerpo de la respuesta.
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo crear el producto.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en crearNuevoProducto:', error);
    throw error;
  }
};


export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: No se pudieron obtener las categorías.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerCategorias:', error);
    throw error;
  }
};


// --- Futuras funciones que podrías necesitar ---



export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: No se pudo obtener el producto.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en obtenerProductoPorId (id: ${id}):`, error);
    throw error;
  }
};




export const actualizarProducto = async (id, datosProducto) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosProducto),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo actualizar el producto.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en actualizarProducto (id: ${id}):`, error);
    throw error;
  }
};



 
export const eliminarProducto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo eliminar el producto.`);
    }
    // DELETE no suele devolver contenido, así que no esperamos un .json()
    return;
  } catch (error) {
    console.error(`Error en eliminarProducto (id: ${id}):`, error);
    throw error;
  }
};
