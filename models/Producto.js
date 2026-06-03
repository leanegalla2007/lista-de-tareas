const db = require("../config/db");

const Producto = {
   // Asegúrate de que esta sea la ruta a tu conexión de BD
  // Método para buscar el ID de un usuario por su nombre
  buscarUsuarioPorNombre: (usuario, callback) => {
    db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], callback);
  },

  // Método para insertar el producto en la base de datos
  crear: (datosProducto, callback) => {
    const { producto, fecha, marca, unidad, precio, categoria, usuario_id } = datosProducto;
    
    db.query(
      "INSERT INTO productos (producto, fecha, marca, unidad, precio, categoria, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [producto, fecha, marca, unidad, precio, categoria, usuario_id],
      callback
    );
  }
};
  // Aquí puedes agregar crear, actualizar, eliminar...
module.exports = Producto;