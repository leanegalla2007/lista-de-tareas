const express = require("express");
const mysql2 = require("mysql2");
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

// OBTENER stock
// app.get("/stock", (req, res) => {
//   db.query("SELECT * FROM stock", (err, result) => {
//     if (err) return res.status(500).send(err); // Manejo básico de error
//     res.json(result);
//   });
// });

// GET Filtrado
app.get("/stock", (req, res) => {
    const categoria = req.query.categoria;
    // Usamos WHERE para que no se mezclen los datos
    const query = "SELECT * FROM stock WHERE categoria = ?";
    db.query(query, [categoria], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// POST con categoría
app.post("/stock", (req, res) => {
    const { producto, marca, precio, unidad, fecha, categoria } = req.body;
    const query = "INSERT INTO stock (producto, marca, precio, unidad, fecha, categoria) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [producto, marca, precio, unidad, fecha, categoria], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Producto guardado");
    });

// // CREAR tarea - Corregido el path
  // app.post("/stock", (req, res) => {
  //   console.log("Recibido POST /stock con body:", req.body); // Debugging
  //   console.log("Tipo de req.body:", typeof req.body); // Debugging
  //   const { producto, fecha, marca, unidad, precio } = req.body;

// Validación básica
  if (!producto) {
    console.log("Falta el nombre del producto"); // Debugging
    return res.status(400).send("Falta el nombre del producto");
  }
  if (!fecha) {
    console.log("Falta la fecha de caducidad del producto"); // Debugging
    return res.status(400).send("Falta la fecha de caducidad del producto");
  }
  if (!marca) {
    console.log("Falta la marca del producto"); // Debugging
    return res.status(400).send("Falta la marca del producto");
  }
  if (!unidad) {
    console.log("Falta la unidad del producto"); // Debugging
    return res.status(400).send("Falta la unidad del producto");
  }
  if (!precio) {
    console.log("Falta el precio del producto"); // Debugging
    return res.status(400).send("Falta el precio del producto");
  }

  console.log("Producto recibido:", producto); // Debugging
  db.query(
    "INSERT INTO stock (producto, fecha, marca, unidad, precio) VALUES (?, ?, ?, ?, ?)",
    [producto, fecha, marca, unidad, precio],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Producto agregado");
    }
  );
});

app.delete("/stock/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM stock WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al eliminar el producto");
    }
    res.send("Producto eliminado");
  });
});

app.delete("/stock", (req, res) => {
  // TRUNCATE vacía la tabla y reinicia el contador de IDs a 1
  db.query("TRUNCATE TABLE stock", (err, result) => {
    if (err) {
      console.error("Error al vaciar la tabla:", err);
      return res.status(500).send("Error al vaciar la lista");
    }
    res.send("Lista vaciada correctamente");
  });
});

const listaActiva = localStorage.getItem('lista_activa');
const res = await fetch(`http://localhost:3000/stock?categoria=${listaActiva}`);

// Es mejor poner los archivos estáticos antes o después de las rutas, 
// pero asegúrate de que el puerto esté bien definido.
app.use(express.static('public')); 

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));