const db = require("../config/db"); // Opcional, si haces los chequeos de usuario aquí
const Producto = require("../models/productoModel");

const obtenerStock = (req, res) => {
  const { categoria } = req.query;
  const usuario = req.headers["x-usuario"];

  if (!usuario) {
    return res.status(401).send("No autorizado. Inicie sesión.");
  }

  db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
    if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
    
    const usuario_id = users[0].id;
    
    Producto.obtenerPorUsuario(usuario_id, categoria, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
};

module.exports = {
  obtenerStock
};2