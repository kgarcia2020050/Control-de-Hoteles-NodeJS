const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Eventos = Schema({
  nombre: String,
  lugar: String,
  descripcion:String,
  fecha: String,
  idHotel: { type: Schema.Types.ObjectId, ref: "Usuarios" },
});

module.exports = mongoose.model("Eventos", Eventos);
