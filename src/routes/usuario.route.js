const express = require('express');
const controller=require('../controllers/inicio.controller')
var api=express.Router()
const autenticacion=require('../middleware/autenticacion')


api.post("/login",controller.Login)
api.post("/registro",controller.registroUsuarios)



module.exports=api;
