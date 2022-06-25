const express = require("express");
const controller = require("../controllers/inicio.controller");
const controlador = require("../controllers/usuario.controller");
var api = express.Router();
const verificacion = require("../middleware/autenticacion");

api.post("/login", controller.Login);
api.post("/registro", controller.registroUsuarios);
api.get("/editarPerfil/:ID", verificacion.Auth, controlador.obtenerId);
api.put("/modificarPerfil/:ID", verificacion.Auth, controlador.editar);
api.get("/verHotel/:ID", verificacion.Auth, controlador.verHotel);
api.post("/pagar/:ID/:precio/:cuarto", controlador.pagarHabitacion);
api.get("/verCuarto/:ID", verificacion.Auth, controlador.verHabitacion);
api.get("/misReservas/:ID", verificacion.Auth, controlador.reservaciones);

api.put("/cancelarReservacion/:ID", controlador.cancelarReservacion);

api.delete(
  "/borrarPerfil/:ID",
  verificacion.Auth,
  controlador.eliminarPerfilUsuario
);
api.get("/historial/:ID", verificacion.Auth, controlador.verHistorial);

module.exports = api;
