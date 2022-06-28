const mongoose= require("mongoose");

const Schema=mongoose.Schema;

const Habitaciones=Schema({
    nombre:String,
    descripcion:String,
    espacio:Number,
    verificar:Boolean,
    disponibilidad:String,
    precio:Number,
    idHotel:{type:Schema.Types.ObjectId,ref:"Usuarios"},
    idUsuario:{type:Schema.Types.ObjectId,ref:"Usuarios"}
})

module.exports=mongoose.model("Habitaciones",Habitaciones)