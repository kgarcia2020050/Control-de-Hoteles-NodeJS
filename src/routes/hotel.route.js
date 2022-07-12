const express = require("express");
const controller = require("../controllers/admin.controller");
var api = express.Router();
const autenticacion = require("../middleware/autenticacion");

api.post("/nuevoHotel", autenticacion.Auth, controller.nuevoHotel);
api.get("/verHoteles", autenticacion.Auth, controller.verHoteles);
api.get("/listaHoteles", controller.verHoteles);
api.get(
  "/usuariosRegistrados",
  autenticacion.Auth,
  controller.usuariosRegistrados
);
api.get(
  "/masSolicitados",
  autenticacion.Auth,
  controller.hotelesMasSolicitados
);

module.exports = api;
