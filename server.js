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
// ==========================================
// RUTAS DE STOCK (Filtradas por usuario)
// ==========================================



// CREAR producto asociado al usuario
// app.post("/stock", (req, res) => {
//   const usuario = req.headers["x-usuario"];
//   const producto = req.body.producto || req.body.descripcion;
//   const fecha = req.body.fecha || null;
//   const marca = req.body.marca || null;
//   const unidad = req.body.unidad || null;
//   const precio = req.body.precio === "" || req.body.precio == null ? null : req.body.precio;
//   const categoria = req.body.categoria || null;

//   if (!usuario) return res.status(401).send("No autorizado. Inicie sesión.");
//   if (!producto) return res.status(400).send("Falta el nombre del producto");
//   if (!categoria) return res.status(400).send("Falta la categoría del producto");

//   // 1. Buscamos el ID del usuario actual
//   db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
//     if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
//     const usuario_id = users[0].id;

//     // 2. Insertamos guardando la relación con su usuario_id
//     db.query(
//       "INSERT INTO productos (producto, fecha, marca, unidad, precio, categoria, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//       [producto, fecha, marca, unidad, precio, categoria, usuario_id],
//       (err, result) => {
//         if (err) {
//           console.error("Error al insertar producto:", err);
//           return res.status(500).send("No se pudo guardar el producto");
//         }
//         res.send("Producto agregado");
//       }
//     );
//   });
// });

// ACTUALIZAR producto (Verificando propiedad)
// app.put("/stock/:id", (req, res) => {
//   const { id } = req.params;
//   const usuario = req.headers["x-usuario"];
//   const { producto, marca, precio, unidad, fecha, categoria } = req.body;

//   if (!usuario) return res.status(401).send("No autorizado.");
//   if (!producto) return res.status(400).send("Falta el nombre del producto");

//   db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
//     if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
//     const usuario_id = users[0].id;

//     // Actualiza sólo si el producto tiene el ID enviado Y pertenece al usuario actual
//     db.query(
//       "UPDATE productos SET producto = ?, marca = ?, precio = ?, unidad = ?, fecha = ?, categoria = ? WHERE id = ? AND usuario_id = ?",
//       [producto, marca, precio, unidad, fecha, categoria, id, usuario_id],
//       (err, result) => {
//         if (err) {
//           console.error("Error al actualizar:", err);
//           return res.status(500).send("No se pudo actualizar el producto");
//         }
//         res.send("Producto actualizado");
//       }
//     );
//   });
// });

// ELIMINAR un producto específico (Verificando propiedad)
app.delete("/stock/:id", (req, res) => {
  const { id } = req.params;
  const usuario = req.headers["x-usuario"];

  if (!usuario) return res.status(401).send("No autorizado.");

  db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
    if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
    const usuario_id = users[0].id;

    db.query("DELETE FROM productos WHERE id = ? AND usuario_id = ?", [id, usuario_id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al eliminar el producto");
      }
      res.send("Producto eliminado");
    });
  });
});

// ELIMINAR una lista o VACÍAR existencias del usuario logueado
app.delete("/stock", (req, res) => {
  const { categoria } = req.query;
  const usuario = req.headers["x-usuario"];

  if (!usuario) return res.status(401).send("No autorizado.");

  db.query("SELECT id FROM usuarios WHERE usuario = ?", [usuario], (err, users) => {
    if (err || users.length === 0) return res.status(401).send("Usuario inválido.");
    const usuario_id = users[0].id;

    // Si llega una categoría, borramos sólo esa lista de este usuario específico
    if (categoria) {
      db.query(
        "DELETE FROM productos WHERE categoria = ? AND usuario_id = ?",
        [categoria, usuario_id],
        (err, result) => {
          if (err) {
            console.error("Error al borrar categoria:", err);
            return res.status(500).send("Error al borrar la lista");
          }
          return res.send("Lista borrada correctamente");
        }
      );
      return;
    }

    // Si no llega categoría, se vacían de la tabla ÚNICAMENTE sus productos
    db.query("DELETE FROM productos WHERE usuario_id = ?", [usuario_id], (err, result) => {
      if (err) {
        console.error("Error al vaciar los productos:", err);
        return res.status(500).send("Error al vaciar la lista");
      }
      res.send("Lista vaciada correctamente");
    });
  });
});

// Ruta simple para cerrar sesión desde backend si fuera necesario
app.post("/auth/cerrar-sesion", (req, res) => {
  res.send("Sesión cerrada exitosamente.");
});


// Servidor de archivos estáticos
// app.use(express.static('public')); 
