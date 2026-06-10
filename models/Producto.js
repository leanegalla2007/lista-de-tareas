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
  }
};
  // Aquí puedes agregar crear, actualizar, eliminar...
module.exports = Producto;