const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// URL: /stock
router.get("/", stockController.obtenerStock);
// router.post("/", stockController.crearProducto); 
// router.put("/:id", stockController.actualizarProducto);

app.post("/auth/registrar", (req, res) => {
  const { usuario, password} = req.body;

  if (!usuario || !password) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

  db.query(
    "INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?)",
    [usuario, password],
    (err, result) => {
      if (err) {
        if (err.errno === 1062) {
          return res.status(400).send("El nombre de usuario ya está en uso.");
        }
        console.error(err);
        return res.status(500).send("Error al registrar el usuario.");
      }
      res.send("Usuario registrado con éxito.");
    }
  );
});

app.post("/auth/login", (req, res) => {
  const { usuario, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, results) => {
      if (err) return res.status(500).send("Error en el servidor.");
      
      if (results.length === 0) {
        return res.status(401).send("Usuario o contraseña incorrectos.");
      }

      const usuarioEncontrado = results[0];
      if (usuarioEncontrado.password === password) {
        res.send("Ingreso exitoso");
      } else {
        res.status(401).send("Usuario o contraseña incorrectos.");
      }
    }
  );
});

app.get('/usuarios', (req, res) => {
    // 1. Capturamos el usuario que viene desde el HTML
    const usuarioRecibido = req.headers['x-usuario']; 

    // 2. Validamos si es el administrador del sistema
    // (Aquí puedes buscarlo en tu base de datos o hacer una comprobación directa)
    if (usuarioRecibido === 'Leandro') {
      db.query("SELECT * FROM usuarios", (err, listaEmpleados) => {
        // Lista de ejemplo de usuarios que devolverá si eres Admin
       // Aquí deberías hacer la consulta real a tu base de datos
        
        return res.json(listaEmpleados); // Devuelve los datos con éxito (res.ok será true)
      });
    } else {
        // Si viene cualquier otro usuario, el servidor responde con Bloqueo
        return res.status(403).send("No tienes permisos para ver esta sección.");
    }
});


module.exports = router;

