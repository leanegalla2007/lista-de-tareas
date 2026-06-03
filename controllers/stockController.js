const db = require("../config/db"); // Opcional, si haces los chequeos de usuario aquí
const path = require("path");
const Producto = require("../models/Producto");

// Metodo para retornar la vista estática home
const home = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
};

const obtenerStock = (req, res) => {
  exports.obtenerStock = (req, res) => {
    const usuario = req.headers["x-usuario"];
    const { categoria } = req.query;

    if (!usuario) return res.status(401).send("No autorizado.");

    // 1. Buscamos el ID del usuario actual
    Producto.buscarUsuarioPorNombre(usuario, (err, users) => {
      if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
      const usuario_id = users[0].id;

      // 2. Traemos sus productos desde el modelo
      Producto.obtenerPorUsuario(usuario_id, categoria, (err, productos) => {
        if (err) return res.status(500).send("Error al obtener los productos.");
        
        // ¡IMPORTANTE! Devolvemos los datos en formato JSON para el Frontend
        res.json(productos); 
      });
    });
  };
}
// crearProductos es el método que se encargará de recibir los datos del producto desde el frontend, validar el usuario y luego llamar al modelo para insertar el producto en la base de datos.
const crearProductos = (req, res) => {
  const usuario = req.headers["x-usuario"];
  const producto = req.body.producto || req.body.descripcion;
  const fecha = req.body.fecha || null;
  const marca = req.body.marca || null;
  const unidad = req.body.unidad || null;
  const precio = req.body.precio === "" || req.body.precio == null ? null : req.body.precio;
  const categoria = req.body.categoria || null;

  if (!usuario) return res.status(401).send("No autorizado. Inicie sesión.");
  if (!producto) return res.status(400).send("Falta el nombre del producto");
  if (!categoria) return res.status(400).send("Falta la categoría del producto"); 

  // 1. Buscamos el ID del usuario actual usando el Modelo
  Producto.buscarUsuarioPorNombre(usuario, (err, users) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).send("Error interno del servidor.");
    }
    if (users.length === 0) {
      return res.status(401).send("Usuario inválido.");
    }
    
    const usuario_id = users[0].id;

    // Preparamos el objeto con los datos limpios para el modelo
    const nuevosDatos = { producto, fecha, marca, unidad, precio, categoria, usuario_id };

    // 2. Insertamos guardando la relación llamando al método del Modelo
    Producto.crear(nuevosDatos, (err, result) => {
      if (err) {
        console.error("Error al insertar producto:", err);
        return res.status(500).send("No se pudo guardar el producto");
      }
      res.send("Producto agregado");
    });
  });
}; 


// exports.crearProducto = (req, res) => {
//   const usuario = req.headers["x-usuario"];
//   const producto = req.body.producto || req.body.descripcion;
//   const fecha = req.body.fecha || null;
//   const marca = req.body.marca || null;
//   const unidad = req.body.unidad || null;
//   const precio = req.body.precio === "" || req.body.precio == null ? null : req.body.precio;
//   const categoria = req.body.categoria || null;

//   // Validaciones iniciales
//   if (!usuario) return res.status(401).send("No autorizado. Inicie sesión.");
//   if (!producto) return res.status(400).send("Falta el nombre del producto");
//   if (!categoria) return res.status(400).send("Falta la categoría del producto");

//   // 1. Buscamos el ID del usuario actual usando el Modelo
//   Producto.buscarUsuarioPorNombre(usuario, (err, users) => {
//     if (err) {
//       console.error("Error al buscar usuario:", err);
//       return res.status(500).send("Error interno del servidor.");
//     }
//     if (users.length === 0) {
//       return res.status(401).send("Usuario inválido.");
//     }
    
//     const usuario_id = users[0].id;

//     // Preparamos el objeto con los datos limpios para el modelo
//     const nuevosDatos = { producto, fecha, marca, unidad, precio, categoria, usuario_id };

//     // 2. Insertamos guardando la relación llamando al método del Modelo
//     Producto.crear(nuevosDatos, (err, result) => {
//       if (err) {
//         console.error("Error al insertar producto:", err);
//         return res.status(500).send("No se pudo guardar el producto");
//       }
//       res.send("Producto agregado");
//     });
//   });
// };

module.exports = {
  home,
  obtenerStock,
  crearProductos
};