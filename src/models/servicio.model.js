const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Servicios = Schema({
  nombre: String,
  descripcion: String,
  precio: String,
  idHotel: { type: Schema.Types.ObjectId, ref: "Usuarios" },
});

module.exports=mongoose.model("Servicios", Servicios);