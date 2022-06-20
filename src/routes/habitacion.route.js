const express = require('express');
const controller=require('../controllers/habitacion.controller')
var api=express.Router()
const autenticacion=require('../middleware/autenticacion')


api.post("/nuevoCuarto/:ID",autenticacion.Auth,controller.agregarHabitacion)
api.get("/verHabitaciones/:ID",autenticacion.Auth,controller.verHabitaciones)
api.delete("/borrarCuarto/:ID/:Hotel",autenticacion.Auth,controller.eliminarCuarto)

module.exports = api;