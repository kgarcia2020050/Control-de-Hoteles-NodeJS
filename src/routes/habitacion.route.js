const express = require('express');
const controller=require('../controllers/habitacion.controller')
var api=express.Router()
const autenticacion=require('../middleware/autenticacion')


api.post("/nuevoCuarto",autenticacion.Auth,controller.agregarHabitacion)
api.get("/verHabitaciones",autenticacion.Auth,controller.verHabitaciones)

module.exports = api;