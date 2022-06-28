const express = require('express');
const controller=require('../controllers/habitacion.controller')
var api=express.Router()
const autenticacion=require('../middleware/autenticacion')


api.post("/nuevoCuarto/:ID",autenticacion.Auth,controller.agregarHabitacion)
api.get("/verCuarto/:ID",autenticacion.Auth,controller.habitacionID)
api.get("/verHabitaciones/:ID",autenticacion.Auth,controller.verHabitaciones)
api.put("/editarCuarto/:ID",autenticacion.Auth,controller.modificarHabitacion)
module.exports = api;