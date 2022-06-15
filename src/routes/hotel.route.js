const express = require('express');
const controller=require('../controllers/admin.controller')
var api=express.Router()
const autenticacion=require('../middleware/autenticacion')


api.post("/nuevoHotel",autenticacion.Auth,controller.nuevoHotel)
api.get("/verHoteles",autenticacion.Auth,controller.verHoteles)
api.delete("/borrarHotel/:ID",autenticacion.Auth,controller.borrarHotel)

module.exports=api;