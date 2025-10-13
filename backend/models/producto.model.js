import sql from '../db/db.js';

// ===== PRODUCTOS BÁSICOS =====
export const getAllProductos = async () => {
  return sql`
    SELECT 
      p.idProducto,
      p.nombre,
      p.precio,
      p.descripcion,
      tp.nombre AS categoria,
      tp.idTipoProducto
    FROM Producto p
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    ORDER BY tp.nombre, p.nombre
  `;
};

export const getProductoById = async (id) => {
  const result = await sql`
    SELECT 
      p.idProducto,
      p.nombre,
      p.precio,
      p.descripcion,
      tp.nombre AS categoria,
      tp.idTipoProducto
    FROM Producto p
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    WHERE p.idProducto = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

export const getProductoConIngredientes = async (id) => {
  const producto = await getProductoById(id);
  if (!producto) return null;

  const ingredientesBase = await sql`
    SELECT 
      i.idIngrediente,
      i.nombre AS ingrediente,
      i.precio,
      pp.cantidad,
      (i.precio * pp.cantidad) AS subtotal
    FROM ProductoPredefinido pp
    JOIN Ingredientes i ON pp.idIngrediente = i.idIngrediente
    WHERE pp.idProducto = ${id}
    ORDER BY i.nombre
  `;

  // Calcular precio total de ingredientes base
  const costoIngredientesBase = ingredientesBase.reduce((total, ing) => 
    total + parseFloat(ing.subtotal), 0
  );

  return {
    ...producto,
    ingredientesBase,
    estadisticas: {
      totalIngredientesBase: ingredientesBase.length,
      costoIngredientesBase: costoIngredientesBase,
      margenProducto: parseFloat(producto.precio) - costoIngredientesBase
    }
  };
};

export const getProductosPorCategoria = async (categoria) => {
  // Verificar si la categoría existe
  const categoriaRow = await sql`
    SELECT idTipoProducto, nombre 
    FROM TipoProducto 
    WHERE LOWER(nombre) = LOWER(${categoria})
  `;
  
  if (categoriaRow.length === 0) return null;

  const productos = await sql`
    SELECT 
      p.idProducto,
      p.nombre,
      p.precio,
      p.descripcion,
      tp.nombre AS categoria,
      tp.idTipoProducto
    FROM Producto p
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    WHERE p.idTipoProducto = ${categoriaRow[0].idtipoproducto}
    ORDER BY p.nombre
  `;

  return productos;
};

// ===== CÁLCULO DE PRECIOS PERSONALIZADOS (MEJORADO) =====
export const calcularPrecioBatch = async ({ 
  idProducto, 
  ingredientesExtra, 
  ingredientesEliminar, 
  cantidad = 1 
}) => {
  // Obtener precio base del producto
  const producto = await getProductoById(idProducto);
  if (!producto) throw new Error('Producto no encontrado');

  let precioBase = parseFloat(producto.precio);
  let totalExtra = 0;
  const ingredientesExtraDetalle = [];
  const ingredientesEliminadosDetalle = [];
  
  const resumen = {
    ingredientesAgregados: 0,
    ingredientesEliminados: ingredientesEliminar ? ingredientesEliminar.length : 0,
    ahorro: 0, // Si eliminamos ingredientes caros
    costoAdicional: 0
  };

  // Calcular costo de ingredientes extra
  if (ingredientesExtra && ingredientesExtra.length > 0) {
    for (const extra of ingredientesExtra) {
      const ingrediente = await sql`
        SELECT precio, nombre 
        FROM Ingredientes 
        WHERE idIngrediente = ${extra.idIngrediente}
      `;
      
      if (ingrediente.length === 0) {
        throw new Error(`Ingrediente con ID ${extra.idIngrediente} no encontrado`);
      }
      
      const cantidadIngrediente = extra.cantidad || 1;
      const precioUnitario = parseFloat(ingrediente[0].precio);
      const costoIngrediente = precioUnitario * cantidadIngrediente;
      
      totalExtra += costoIngrediente;
      ingredientesExtraDetalle.push({
        idIngrediente: extra.idIngrediente,
        nombre: ingrediente[0].nombre,
        precioUnitario: precioUnitario,
        cantidad: cantidadIngrediente,
        subtotal: costoIngrediente
      });
      
      resumen.ingredientesAgregados++;
      resumen.costoAdicional += costoIngrediente;
    }
  }

  // Procesar ingredientes eliminados (para información, no afecta precio)
  if (ingredientesEliminar && ingredientesEliminar.length > 0) {
    for (const idIngredienteEliminar of ingredientesEliminar) {
      const ingrediente = await sql`
        SELECT i.nombre, i.precio, pp.cantidad
        FROM Ingredientes i
        JOIN ProductoPredefinido pp ON i.idIngrediente = pp.idIngrediente
        WHERE i.idIngrediente = ${idIngredienteEliminar} 
        AND pp.idProducto = ${idProducto}
      `;
      
      if (ingrediente.length > 0) {
        const ahorroPotencial = parseFloat(ingrediente[0].precio) * ingrediente[0].cantidad;
        ingredientesEliminadosDetalle.push({
          idIngrediente: idIngredienteEliminar,
          nombre: ingrediente[0].nombre,
          precioUnitario: parseFloat(ingrediente[0].precio),
          cantidad: ingrediente[0].cantidad,
          ahorroPotencial: ahorroPotencial
        });
        resumen.ahorro += ahorroPotencial;
      }
    }
  }
  
  const precioFinal = precioBase + totalExtra;

  return {
    precioBase,
    totalExtra,
    precioFinal,
    ingredientesExtra: ingredientesExtraDetalle,
    ingredientesEliminados: ingredientesEliminadosDetalle,
    resumen: {
      ...resumen,
      impactoTotal: totalExtra,
      porcentajeAumento: precioBase > 0 ? ((totalExtra / precioBase) * 100) : 0
    }
  };
};

// ===== UTILIDADES Y ESTADÍSTICAS =====
export const getCategoriasProductos = async () => {
  return sql`
    SELECT 
      tp.idTipoProducto,
      tp.nombre AS categoria,
      COUNT(p.idProducto) AS cantidadProductos,
      COALESCE(AVG(p.precio), 0) AS precioPromedio,
      COALESCE(MIN(p.precio), 0) AS precioMinimo,
      COALESCE(MAX(p.precio), 0) AS precioMaximo
    FROM TipoProducto tp
    LEFT JOIN Producto p ON tp.idTipoProducto = p.idTipoProducto
    GROUP BY tp.idTipoProducto, tp.nombre
    ORDER BY tp.nombre
  `;
};

export const buscarProductos = async (termino) => {
  return sql`
    SELECT 
      p.idProducto,
      p.nombre,
      p.precio,
      p.descripcion,
      tp.nombre AS categoria
    FROM Producto p
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    WHERE LOWER(p.nombre) LIKE LOWER(${'%' + termino + '%'})
       OR LOWER(p.descripcion) LIKE LOWER(${'%' + termino + '%'})
    ORDER BY p.nombre
  `;
};

export const getProductosMasVendidos = async (limite = 10) => {
  return sql`
    SELECT 
      p.idProducto,
      p.nombre,
      p.precio,
      tp.nombre AS categoria,
      SUM(dp.cantidad) AS totalVendido,
      SUM(dp.cantidad * p.precio) AS ingresoTotal,
      COUNT(DISTINCT dp.idPedido) AS pedidosConEsteProducto
    FROM Producto p
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    JOIN DetallePedido dp ON p.idProducto = dp.idProducto
    JOIN Pedido ped ON dp.idPedido = ped.idPedido
    WHERE ped.idEstadoPedido IN (2, 3) -- Solo pedidos completados
    GROUP BY p.idProducto, p.nombre, p.precio, tp.nombre
    ORDER BY totalVendido DESC
    LIMIT ${limite}
  `;
};

export const getEstadisticasProducto = async (idProducto) => {
  const estadisticas = await sql`
    SELECT 
      COUNT(DISTINCT dp.idPedido) AS pedidosQueLoIncluyen,
      SUM(dp.cantidad) AS cantidadTotalVendida,
      SUM(dp.cantidad * p.precio) AS ingresoTotal,
      AVG(dp.cantidad) AS cantidadPromedioPorPedido,
      COUNT(DISTINCT a.idIngrediente) AS ingredientesExtraUsados
    FROM Producto p
    LEFT JOIN DetallePedido dp ON p.idProducto = dp.idProducto
    LEFT JOIN Pedido ped ON dp.idPedido = ped.idPedido AND ped.idEstadoPedido IN (2, 3)
    LEFT JOIN Adicionales a ON dp.idDetallePedido = a.idDetallePedido
    WHERE p.idProducto = ${idProducto}
    GROUP BY p.idProducto
  `;

  return estadisticas.length > 0 ? estadisticas[0] : {
    pedidosQueLoIncluyen: 0,
    cantidadTotalVendida: 0,
    ingresoTotal: 0,
    cantidadPromedioPorPedido: 0,
    ingredientesExtraUsados: 0
  };
};