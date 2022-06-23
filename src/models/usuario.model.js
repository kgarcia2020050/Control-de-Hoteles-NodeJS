const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Usuarios= Schema({
    nombre:String,
    email:String,
    password:String,
    rol:String,
    direccion:String,
    cuartos:Number,
    gerente:String,
    solicitado:Number,
    dia:Number,
    mes:Number,
    anio:Number,
    telefono:String
})

module.exports =mongoose.model("Usuarios",Usuarios)