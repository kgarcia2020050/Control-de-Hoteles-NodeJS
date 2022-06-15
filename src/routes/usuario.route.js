const express = require('express');
const controller=require('../controllers/inicio.controller')
var api=express.Router()


api.post("/login",controller.Login)
api.post("/registro",controller.registroUsuarios)



module.exports=api;
