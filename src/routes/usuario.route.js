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
api.get("/hotelEspecifico/:ID", controlador.verHotel);
api.post("/pagar/:ID/:cuarto/:dias", controlador.pagarHabitacion);
api.get("/verCuarto/:ID", verificacion.Auth, controlador.verHabitacion);
api.get("/misReservas/:ID", verificacion.Auth, controlador.reservaciones);
api.put("/editarHotel/:ID", verificacion.Auth, controlador.editarHotel);
api.post("/nuevoEvento/:ID", verificacion.Auth, controlador.agregarEvento);
api.get("/misEventos/:ID", verificacion.Auth, controlador.verEventos);
api.get("/eventosHotel/:ID", controlador.verEventos);
api.put("/cancelarReservacion/:ID", controlador.cancelarReservacion);
api.get("/eventoHotel/:ID", verificacion.Auth, controlador.verEventos);
api.get("/eventosHotel/:ID", controlador.verEventos);
api.post(
  "/comprarServicio/:ID/:service/:IdService",
  verificacion.Auth,
  controlador.comprarServicio
);

api.delete(
  "/borrarPerfil/:ID",
  verificacion.Auth,
  controlador.eliminarPerfilUsuario
);
api.get("/historial/:ID", verificacion.Auth, controlador.verHistorial);

api.get("/verFactura/:ID", verificacion.Auth, controlador.verCompras);
api.put("/facturar/:ID", verificacion.Auth, controlador.facturar);

module.exports = api;
