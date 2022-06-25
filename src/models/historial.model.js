const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Historiales = Schema({
  idHotel: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
});

module.exports = mongoose.model("Historiales", Historiales);
