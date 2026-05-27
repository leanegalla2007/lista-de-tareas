const db = require("../config/db");

const Producto = {
  obtenerPorUsuario: (usuario_id, categoria, callback) => {
    let sql = "SELECT * FROM productos WHERE usuario_id = ?";
    let params = [usuario_id];
    
    if (categoria) {
        sql += " AND categoria = ?";
        params.push(categoria);
    }
    
    db.query(sql, params, callback);
  },
  
  // Aquí puedes agregar crear, actualizar, eliminar...
};

module.exports = Producto;