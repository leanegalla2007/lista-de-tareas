const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// URL: /stock
router.get("/", stockController.obtenerStock);
// router.post("/", stockController.crearProducto); 
// router.put("/:id", stockController.actualizarProducto);

router.get("/vista", stockController.obtenerVistaProductos);

router.post("/stock", (req, res) => {
  const usuario = req.headers["x-usuario"];
  const producto = req.body.producto || req.body.descripcion;
  const fecha = req.body.fecha || null;
  const marca = req.body.marca || null;
  const unidad = req.body.unidad || null;
  const precio = req.body.precio === "" || req.body.precio == null ? null : req.body.precio;
  const categoria = req.body.categoria || null;
});

module.exports = router;
