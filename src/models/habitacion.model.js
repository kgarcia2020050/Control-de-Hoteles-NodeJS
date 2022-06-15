const mongoose= require("mongoose");

const Schema=mongoose.Schema;

const Habitaciones=Schema({
    nombre:String,
    espacio:Number,
    verificar:Boolean,
    disponibilidad:String,
    idHotel:{type:Schema.Types.ObjectId,ref:"Usuarios"},
})

module.exports=mongoose.model("Habitaciones",Habitaciones)