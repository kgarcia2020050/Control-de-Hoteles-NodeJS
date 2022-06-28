const express = require("express");
const controller = require("../controllers/hotel.controller");
var api = express.Router();
const autenticacion = require("../middleware/autenticacion");

api.post(
  "/agregarServicio/:ID",
  autenticacion.Auth,
  controller.agregarServicio
);
api.delete("/borrarEvento/:ID", autenticacion.Auth, controller.borrarEvento);
api.get("/misServicios/:ID", autenticacion.Auth, controller.misServicios);
api.delete("/borrarServicio/:ID", autenticacion.Auth, controller.borrarServicio);
api.get("/servicioHotel/:ID", autenticacion.Auth, controller.misServicios);

module.exports = api;
