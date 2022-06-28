const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Historiales = Schema({
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  idHotel: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  idServicio: { type: Schema.Types.ObjectId, ref: "Servicios" },
});

module.exports = mongoose.model("Historiales", Historiales);
