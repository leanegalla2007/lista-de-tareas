const express = require("express");
const mysql = require("mysql2");

const app = express();

// IMPORTANTE: Habilita el parseo de JSON para recibir datos en el body
app.use(express.json());

// Conexión a la base
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tareas_db"
});

// OBTENER tareas
app.get("/tareas", (req, res) => {
  db.query("SELECT * FROM tareas", (err, result) => {
    if (err) return res.status(500).send(err); // Manejo básico de error
    res.json(result);
  });
});

// CREAR tarea - Corregido el path
app.post("/tareas", (req, res) => {
  console.log("Recibido POST /tareas con body:", req.body); // Debugging
  console.log("Tipo de req.body:", typeof res); // Debugging
  const { descripcion, fecha, encargado } = req.body;

  // Validación básica
  if (!descripcion) {
    console.log("Falta la descripción de la tarea"); // Debugging 
    return res.status(400).send("Falta la descripción de la tarea");
  }
  if (!fecha) {
    console.log("Falta la fecha de la tarea"); // Debugging
    return res.status(400).send("Falta la fecha de la tarea");
  }
  if (!encargado) {
    console.log("Falta el encargado de la tarea"); // Debugging
    return res.status(400).send("Falta el encargado de la tarea");
  }

  console.log("Descripción recibida:", descripcion); // Debugging
  db.query(
    "INSERT INTO tareas (descripcion, fecha, encargado) VALUES (?, ?, ?)",
    [descripcion, fecha, encargado],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Tarea agregada");
    }
  );
});

// Es mejor poner los archivos estáticos antes o después de las rutas, 
// pero asegúrate de que el puerto esté bien definido.
app.use(express.static('public')); 

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));