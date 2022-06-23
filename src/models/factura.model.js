const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const Facturas=Schema({
    total:Number,
    idUsuario:{type:Schema.Types.ObjectId,ref:"Usuarios"}
})

module.exports = mongoose.model("Facturas",Facturas)