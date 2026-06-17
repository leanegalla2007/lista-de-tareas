const db = require("../config/db");

const Producto = {
   // Asegúrate de que esta sea la ruta a tu conexión de BD
  // Método para buscar el ID de un usuario por su nombre
  obtenerPorUsuario: (usuario_id, categoria, callback) => {
    let sql = "SELECT * FROM productos WHERE usuario_id = ?";
    let params = [usuario_id];
    
    // Si desde el frontend pasas una categoría (?categoria=Alimentos), la filtra
    if (categoria) {
        sql += " AND categoria = ?";
        params.push(categoria);
    }
    
    db.query(sql, params, callback);
  },
  
  buscarUsuarioPorNombre: (usuario, callback) => {
    db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], callback);
  },

//FUNCION PARA LA CREACION DE LOS PRODUCTOS DESDE MYSQL
  crear: (datosProducto, callback) => {
    const { producto, fecha, marca, unidad, precio, categoria, usuario_id } = datosProducto;
    
    db.query(
      "INSERT INTO productos (producto, fecha, marca, unidad, precio, categoria, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [producto, fecha, marca, unidad, precio, categoria, usuario_id],
      callback
    );
  },

//FUNCION PARA LA ACTUALIZACION DE LOS PRODUCTOS DENTRO DE MYSQL
  actualizar: (datosProducto, callback) => {
    const {producto, fecha, marca, unidad, precio, categoria, usuario_id, id } = datosProducto;
    db.query(
      "UPDATE productos SET producto = ?, marca = ?, precio = ?, unidad = ?, fecha = ?, categoria = ? WHERE id = ? AND usuario_id = ?",
      [producto, marca, precio, unidad, fecha, categoria, id, usuario_id],
      callback
    );
  },

//FUNCION PARA LA ELIMINACION DE LOS PRODUCTOS DENTRO DE MYSQL
  eliminar: (id, usuario_id, callback) => {
    db.query(
      "DELETE FROM productos WHERE id = ? AND usuario_id = ?",
      [id, usuario_id],
      callback
    );
  },

//FUNCION PARA LA ELIMINACION DE LAS TABLAS DENTRO MYSQL
  borrar: (usuario_id, categoria, callback) => {
    if (categoria) {
      // Si hay categoría, borramos solo esa
      db.query(
        "DELETE FROM productos WHERE categoria = ? AND usuario_id = ?",
        [categoria, usuario_id],
        callback
      );
    } else {
      // Si no hay categoría, vaciamos absolutamente todo lo del usuario
      db.query(
        "DELETE FROM productos WHERE usuario_id = ?",
        [usuario_id],
        callback
      );
    }
  }

};
  // Aquí puedes agregar crear, actualizar, eliminar...
module.exports = Producto;