const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Historiales = Schema({
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  historial: [
    {
      nombre: String,
    },
  ],
});

module.exports = mongoose.model("Historiales", Historiales);
