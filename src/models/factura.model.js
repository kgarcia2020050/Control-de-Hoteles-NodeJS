const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Facturas = Schema({
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  factura: [
    {
      compra: String,
      precio: Number,
    },
  ],

  total: Number,
});

module.exports = mongoose.model("Facturas", Facturas);
