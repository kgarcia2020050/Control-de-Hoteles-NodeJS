const express = require('express');
const controller=require('../controllers/inicio.controller')
const controlador=require("../controllers/usuario.controller")
var api=express.Router()
const verificacion=require("../middleware/autenticacion")


api.post("/login",controller.Login)
api.post("/registro",controller.registroUsuarios)
api.get("/editarPerfil/:ID",verificacion.Auth,controlador.obtenerId)
api.put("/modificarPerfil/:ID",verificacion.Auth,controlador.editar)

module.exports=api;
