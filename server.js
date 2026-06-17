const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
 // Importas tus rutas separadas
const stockRoutes = require("./routes/stockRoutes");

const app = express();

// Habilita el parseo de JSON para recibir datos en el body
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Conectas las rutas al servidor
app.use("/", stockRoutes);

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stock_db"
});

// ==========================================
// RUTAS DE AUTENTICACIÓN (Prefijo /auth)
// ==========================================

// RUTA PARA REGISTRAR UN USUARIO NUEVO
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

// RUTA PARA INICIAR SESIÓN (LOGIN)
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

// Ejemplo de la ruta en tu Backend (Node.js + Express)
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

// Ruta simple para cerrar sesión desde backend si fuera necesario
app.post("/auth/cerrar-sesion", (req, res) => {
  res.send("Sesión cerrada exitosamente.");
});


// Servidor de archivos estáticos
// app.use(express.static('public')); 
