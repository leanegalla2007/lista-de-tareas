const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// IMPORTANTE: Habilita el parseo de JSON para recibir datos en el body
app.use(express.json());
app.use(cors());

// Conexión a la base
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stock_db"
});

// OBTENER productos
app.get("/stock", (req, res) => {
  const { categoria } = req.query;
  let sql = "SELECT * FROM productos";
  let params = [];

  if (categoria) {
    sql += " WHERE categoria = ?";
    params.push(categoria);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).send(err); // Manejo básico de error
    res.json(result);
  });
});

// CREAR producto - Corregido el path
app.post("/stock", (req, res) => {
  console.log("Recibido POST /stock con body:", req.body); // Debugging
  console.log("Tipo de req.body:", typeof req.body); // Debugging
  const producto = req.body.producto || req.body.descripcion;
  const fecha = req.body.fecha || null;
  const marca = req.body.marca || null;
  const unidad = req.body.unidad || null;
  const precio = req.body.precio === "" || req.body.precio == null ? null : req.body.precio;
  const categoria = req.body.categoria || null;

  // Validación básica
  if (!producto) {
    console.log("Falta el nombre del producto"); // Debugging
    return res.status(400).send("Falta el nombre del producto");
  }
  if (!categoria) {
    console.log("Falta la categoria del producto");
    return res.status(400).send("Falta la categoria del producto");
  }

  console.log("Producto recibido:", producto); // Debugging
  db.query(
    "INSERT INTO productos (producto, fecha, marca, unidad, precio, categoria) VALUES (?, ?, ?, ?, ?, ?)",
    [producto, fecha, marca, unidad, precio, categoria],
    (err, result) => {
      if (err) {
        console.error("Error al insertar producto:", err);
        return res.status(500).send("No se pudo guardar el producto");
      }
      res.send("Producto agregado");
    }
  );
});

app.put("/stock/:id", (req, res) => {
  const { id } = req.params;
  const { producto, marca, precio, unidad, fecha, categoria } = req.body;

  if (!producto) {
    return res.status(400).send("Falta el nombre del producto");
  }

  db.query(
    "UPDATE productos SET producto = ?, marca = ?, precio = ?, unidad = ?, fecha = ?, categoria = ? WHERE id = ?",
    [producto, marca, precio, unidad, fecha, categoria, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar:", err);
        return res.status(500).send("No se pudo actualizar el producto");
      }
      res.send("Producto actualizado");
    }
  );
});

app.delete("/stock/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al eliminar el producto");
    }
    res.send("Producto eliminado");
  });
});

app.delete("/stock", (req, res) => {
  const { categoria } = req.query;

  // Si llega categoria, borra solo esa "tabla lógica" (categoría)
  if (categoria) {
    db.query("DELETE FROM productos WHERE categoria = ?", [categoria], (err, result) => {
      if (err) {
        console.error("Error al borrar categoria:", err);
        return res.status(500).send("Error al borrar la lista");
      }
      return res.send("Lista borrada correctamente");
    });
    return;
  }

  // Si no llega categoria, vacía toda la tabla
  db.query("TRUNCATE TABLE productos", (err, result) => {
    if (err) {
      console.error("Error al vaciar la tabla:", err);
      return res.status(500).send("Error al vaciar la lista");
    }
    res.send("Lista vaciada correctamente");
  });
});


// RUTA PARA REGISTRAR UN USUARIO NUEVO
app.post("/registrar", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).send("Usuario y contraseña son obligatorios.");
  }

  // Insertamos el usuario en la tabla de MySQL
  db.query(
    "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
    [usuario, password],
    (err, result) => {
      if (err) {
        // El código de error 1062 en MySQL significa que el valor UNIQUE ya existe (usuario duplicado)
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
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  // Buscamos si existe un usuario con ese nombre exacto
  db.query(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, results) => {
      if (err) return res.status(500).send("Error en el servidor.");
      
      // Si el array results está vacío, significa que el usuario no existe
      if (results.length === 0) {
        return res.status(401).send("Usuario o contraseña incorrectos.");
      }

      const usuarioEncontrado = results[0];

      // Comparamos la contraseña enviada con la de la base de datos
      if (usuarioEncontrado.password === password) {
        res.send("Ingreso exitoso");
      } else {
        res.status(401).send("Usuario o contraseña incorrectos.");
      }
    }
  );
});
// Es mejor poner los archivos estáticos antes o después de las rutas, 
// pero asegúrate de que el puerto esté bien definido.
app.use(express.static('public')); 

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));