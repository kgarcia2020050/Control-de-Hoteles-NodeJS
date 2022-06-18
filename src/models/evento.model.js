const mongoose = require('mongoose')
const Schema=mongoose.Schema;

const Eventos=Schema({
    nombre:String,
    lugar:String,
    fecha:String,
    horario:String,
    idHotel:{type:Schema.Types.ObjectId,ref:"Usuarios"}
})

module.exports=mongoose.model("Eventos",Eventos)