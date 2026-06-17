const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// URL: /stock
router.get("/stock", stockController.obtenerStock);
router.post("/crear", stockController.crearProductos); 
router.put("/:id", stockController.actualizarProducto);
router.delete("/", stockController.borrarStock);
router.delete("/borrar/:id", stockController.eliminarProducto);
// router.get("/vista", stockController.obtenerVistaProductos);

module.exports = router;