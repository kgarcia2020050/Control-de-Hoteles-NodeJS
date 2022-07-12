const express = require("express");
const controller = require("../controllers/habitacion.controller");
var api = express.Router();
const autenticacion = require("../middleware/autenticacion");

api.post("/nuevoCuarto/:ID", autenticacion.Auth, controller.agregarHabitacion);
api.get("/verCuarto/:ID", autenticacion.Auth, controller.habitacionID);
api.get("/verHabitaciones/:ID", autenticacion.Auth, controller.verHabitaciones);
api.get("/habitacionesHotel/:ID", controller.verHabitaciones);
api.put(
  "/editarCuarto/:ID",
  autenticacion.Auth,
  controller.modificarHabitacion
);
api.get("/disponibles/:ID", autenticacion.Auth, controller.disponibilidad);
api.get("/reservadas/:ID", autenticacion.Auth, controller.ocupadas);
module.exports = api;
