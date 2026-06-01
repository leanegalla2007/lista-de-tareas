const db = require("../config/db"); // Opcional, si haces los chequeos de usuario aquí
const path = require("path");

const obtenerStock = (req, res) => {
  const { categoria } = req.query;
  const usuario = req.headers["x-usuario"];

  if (!usuario) {
    return res.status(401).send("No autorizado. Inicie sesión.");
  }

  db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
    if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
    
    const usuario_id = users[0].id;
    
    // Traer productos que pertenezcan EXCLUSIVAMENTE a este usuario
    let sql = "SELECT * FROM productos WHERE usuario_id = ?";
    let params = [usuario_id];

    if (categoria) {
      sql += " AND categoria = ?";
      params.push(categoria);
    }

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
};

const obtenerVistaProductos = (req, res) => {
  // Retorna el HTML de la tabla de productos (la vista estática)
  res.sendFile(path.join(__dirname, "../public/table.html"));
}; 

module.exports = {
  obtenerStock,
  obtenerVistaProductos
};