const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stock_db"
});

db.connect((err) => {
  if (err) console.error("Error conectando a la BD: ", err);
  else console.log("Conectado a MySQL");
});

module.exports = db;