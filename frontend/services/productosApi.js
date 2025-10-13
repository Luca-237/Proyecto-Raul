// services/productosApi.js
const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu configuración

// Función base para hacer peticiones HTTP
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ===== SERVICIOS DE PRODUCTOS =====

/**
 * Obtener todos los productos
 * @param {boolean} incluirIngredientes - Si incluir ingredientes base
 * @returns {Promise<Array>} Lista de productos
 */
export const obtenerTodosLosProductos = async (incluirIngredientes = false) => {
  const url = `${API_BASE_URL}/productos${incluirIngredientes ? '?incluirIngredientes=true' : ''}`;
  return await apiRequest(url);
};

/**
 * Obtener producto por ID con ingredientes base
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto con detalles
 */
export const obtenerProductoPorId = async (id) => {
  const url = `${API_BASE_URL}/productos/${id}`;
  return await apiRequest(url);
};

/**
 * Obtener productos por categoría
 * @param {string} categoria - Nombre de la categoría
 * @param {boolean} incluirIngredientes - Si incluir ingredientes base
 * @returns {Promise<Array>} Lista de productos de la categoría
 */
export const obtenerProductosPorCategoria = async (categoria, incluirIngredientes = false) => {
  const url = `${API_BASE_URL}/productos/categoria/${categoria}${incluirIngredientes ? '?incluirIngredientes=true' : ''}`;
  return await apiRequest(url);
};

/**
 * Calcular precio personalizado de un producto
 * @param {number} idProducto - ID del producto
 * @param {Object} personalizacion - Configuración de personalización
 * @param {Array} personalizacion.ingredientesExtra - Ingredientes extra
 * @param {Array} personalizacion.ingredientesEliminar - Ingredientes a eliminar
 * @param {number} personalizacion.cantidad - Cantidad del producto
 * @returns {Promise<Object>} Cálculo de precio detallado
 */
export const calcularPrecioPersonalizado = async (idProducto, personalizacion = {}) => {
  const url = `${API_BASE_URL}/productos/${idProducto}/calcular-precio`;
  const body = {
    ingredientesExtra: personalizacion.ingredientesExtra || [],
    ingredientesEliminar: personalizacion.ingredientesEliminar || [],
    cantidad: personalizacion.cantidad || 1
  };
  
  return await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
};

// ===== UTILIDADES =====

/**
 * Transformar producto del backend al formato del frontend
 * @param {Object} productoBackend - Producto del backend
 * @returns {Object} Producto en formato frontend
 */
export const transformarProductoBackend = (productoBackend) => {
  return {
    id: productoBackend.idproducto || productoBackend.idProducto,
    name: productoBackend.nombre,
    href: "#", // Puedes generar URLs específicas aquí
    price: `$${productoBackend.precio}`,
    category: productoBackend.categoria,
    imageSrc: obtenerImagenPorCategoria(productoBackend.categoria, productoBackend.nombre),
    imageAlt: `${productoBackend.nombre} - ${productoBackend.descripcion || productoBackend.categoria}`,
    descripcion: productoBackend.descripcion,
    ingredientesBase: productoBackend.ingredientesBase || []
  };
};

/**
 * Obtener imagen por categoría y nombre (fallback a imágenes por defecto)
 * @param {string} categoria - Categoría del producto
 * @param {string} nombre - Nombre del producto
 * @returns {string} URL de la imagen
 */
export const obtenerImagenPorCategoria = (categoria, nombre) => {
  const categoriaLower = categoria.toLowerCase();
  const nombreLower = nombre.toLowerCase();

  // Mapeo de imágenes por categoría
  const imagenesCategoria = {
    hamburguesa: [
      "https://media.istockphoto.com/id/840902892/es/foto/hamburguesa-aislado-en-blanco.jpg?s=612x612&w=0&k=20&c=uQIMRE1GPy8nh_WiCmK70qg30fjUaxnStPLVR2KLJHU=",
      "https://media.istockphoto.com/id/1130865856/es/foto/hamburguesa-con-queso-y-carne.jpg?s=612x612&w=0&k=20&c=Crz1_qwd7RkTBrzP9mrIQbWxDr2j7oV7B4dFZAvSr-M=",
      "https://media.istockphoto.com/id/1315035442/es/foto/hamburguesa-de-garbanzos.jpg?s=612x612&w=0&k=20&c=O4oTwvVfRk0Po4b6ngCJST6sP9QyH1ef0PBR2KxLOtE=",
      "https://media.istockphoto.com/id/1211105873/es/foto/hamburguesa-con-salsa-bbq.jpg?s=612x612&w=0&k=20&c=RtLP_44v7VfORFZg5NuvMyWWjeh7A6DJ0X3ZruLbf4g="
    ],
    papa: [
      "https://media.istockphoto.com/id/471748896/es/foto/papas-fritas.jpg?s=612x612&w=0&k=20&c=brnEhS2yPC2fTFzLhzK-5wPIL4bC0slO_mnqHWz31Rg=",
      "https://media.istockphoto.com/id/1213419557/es/foto/papas-fritas.jpg?s=612x612&w=0&k=20&c=lYFymMTDE8spD1aOGz1bgSRBql2MzyUmxYgUIv2aHtY=",
      "https://media.istockphoto.com/id/621681802/es/foto/papas-fritas-en-una-caja.jpg?s=612x612&w=0&k=20&c=zYl4dZuP19xxLr_7E9yP7hHZH3IufGB7LbCj7E4uQzQ="
    ],
    bebida: [
      "https://media.istockphoto.com/id/458749181/es/foto/botella-de-coca-cola.jpg?s=612x612&w=0&k=20&c=Enn3NMTwOshvUomShESkQl9A69Lwo02HzfI15okDJfM=",
      "https://media.istockphoto.com/id/1402164564/es/foto/botella-de-agua.jpg?s=612x612&w=0&k=20&c=RwTEKHAgd1N0vT1u_YlU5Ql8pH5QGdJkAPln3NRfjO4=",
      "https://media.istockphoto.com/id/458748235/es/foto/botella-de-sprite.jpg?s=612x612&w=0&k=20&c=3fCNR1mEmtSPgyu4paObPugydHEyiQdgkA6l2zbfTn0="
    ]
  };

  // Buscar por categoría
  let imagenes = [];
  for (const [key, urls] of Object.entries(imagenesCategoria)) {
    if (categoriaLower.includes(key)) {
      imagenes = urls;
      break;
    }
  }

  // Si no hay imágenes específicas, usar la primera disponible
  if (imagenes.length === 0) {
    imagenes = imagenesCategoria.hamburguesa; // fallback
  }

  // Seleccionar imagen aleatoria o basada en el nombre
  const index = Math.abs(nombreLower.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % imagenes.length;
  return imagenes[index];
};

// ===== HOOKS PERSONALIZADOS (para usar en componentes React) =====

/**
 * Hook para manejar estados de carga de productos
 */
export const useProductosState = () => {
  const [productos, setProductos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const cargarProductos = async (filtros = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let productosRaw;
      
      if (filtros.categoria) {
        productosRaw = await obtenerProductosPorCategoria(filtros.categoria, filtros.incluirIngredientes);
      } else {
        productosRaw = await obtenerTodosLosProductos(filtros.incluirIngredientes);
      }
      
      const productosTransformados = productosRaw.map(transformarProductoBackend);
      setProductos(productosTransformados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading,
    error,
    cargarProductos,
    setProductos
  };
};