const Eventos = require("../models/evento.model");
const Servicios = require("../models/servicio.model");

function borrarEvento(req, res) {
  Eventos.findByIdAndDelete({ _id: req.params.ID }, (error, eventoBorrado) => {
    if (error)
      return res.status(500).send({ Error: "Error al borrar el evento" });
    return res.status(200).send({ EventoBorrado: eventoBorrado });
  });
}

function agregarServicio(req, res) {
  var datos = req.body;
  Servicios.create(
    {
      idHotel: req.params.ID,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
    },
    (error, servicioCreado) => {
      if (error)
        return res.status(500).send({ Error: "Error al crear el servicio" });
      return res.status(200).send({ ServicioCreado: servicioCreado });
    }
  );
}

function misServicios(req, res) {
  Servicios.find({ idHotel: req.params.ID }, (error, servicios) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener los servicios" });
    return res.status(200).send({ Servicios: servicios });
  });
}

function borrarServicio(req, res) {
  Servicios.findByIdAndDelete(
    { _id: req.params.ID },
    (error, servicioBorrado) => {
      if (error)
        return res.status(500).send({ Error: "Error al borrar el servicio" });
      return res.status(200).send({ ServicioBorrado: servicioBorrado });
    }
  );
}


module.exports = {
  agregarServicio,
  borrarEvento,
  misServicios,
  borrarServicio,
};
