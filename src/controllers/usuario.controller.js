const Usuarios = require("../models/usuario.model");
const Habitaciones = require("../models/habitacion.model");
const Facturas = require("../models/factura.model");
const { response } = require("express");

function editar(req, res) {
  var datos = req.body;
  /*   if (datos.cuartos) {
    Usuarios.findByIdAndUpdate(
      { _id: req.params.ID },
      { $inc: { cuartos: datos.cuartos * 1 } },
      datos,
      { new: true },
      (error, perfilEditado) => {
        if (error)
          return res.status(500).send({ Error: "Error al editar el perfil." });
        if (!perfilEditado)
          return res
            .status(500)
            .send({ Error: "No se pudo editar al perfil." });
        return res.status(200).send({ Exito: "Perfil editado exitósamente." });
      }
    );
  } else { */
  Usuarios.findByIdAndUpdate(
    { _id: req.params.ID },
    datos,
    { new: true },
    (error, perfilEditado) => {
      if (error)
        return res.status(500).send({ Error: "Error al editar el perfil." });
      if (!perfilEditado)
        return res.status(500).send({ Error: "No se pudo editar al perfil." });
      return res.status(200).send({ Exito: "Perfil editado exitósamente." });
    }
  );
  // }
}

function obtenerId(req, res) {
  //console.log( hoy.getFullYear().toString() )
  Usuarios.findById({ _id: req.params.ID }, (error, perfilEncontrado) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener el perfil." });
    if (!perfilEncontrado)
      return res.status(500).send({ Error: "Este perfil no existe." });
    return res.status(200).send({ Perfil: perfilEncontrado });
  });
}

function verHotel(req, res) {
  Usuarios.findById({ _id: req.params.ID }, (error, hotelEncontrado) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al traer la información del hotel." });
    Habitaciones.find(
      { idHotel: hotelEncontrado._id },
      (error, habitacionesEncontradas) => {
        if (error)
          return res
            .status(500)
            .send({ Error: "Error al traer las habitaciones del hotel." });
        return res.status(200).send({
          Hotel: hotelEncontrado,
          habitaciones: habitacionesEncontradas,
        });
      }
    );
  });
}

function pagarHabitacion(req, res) {
  Facturas.findOne({ idUsuario: req.params.ID }, (error, facturaEncontrada) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al buscar facturas del usuario." });
    if (facturaEncontrada) {
      Habitaciones.findByIdAndUpdate(
        { _id: req.params.cuarto },
        {
          disponibilidad: "RESERVADA",
          verificar: false,
          idUsuario: req.params.ID,
        },
        { new: true },
        (error, cuartoOcupado) => {
          Facturas.findOneAndUpdate(
            { idUsuario: req.params.ID },
            { $inc: { total: req.params.precio * 1 } },
            { new: true },
            (error, facturaActualizada) => {
              if (error)
                return res.status(500).send({
                  Error: "Error al actualizar el precio de la factura",
                });
              return res
                .status(200)
                .send({ Precio_actualizado: facturaActualizada });
            }
          );
        }
      );
    } else {
      if (req.params.precio <= 0) {
        return res
          .status(500)
          .send({ Error: "Debes quedarte al menos un dia." });
      } else {
        Habitaciones.findByIdAndUpdate(
          { _id: req.params.cuarto },
          { disponibilidad: "RESERVADA", verificar: false },
          { new: true },
          (error, cuartoOcupado) => {
            if (error)
              return res
                .status(500)
                .send({ Error: "Error al obtener el cuarto" });
            var modeloFactura = new Facturas();
            modeloFactura.total = req.params.precio;
            modeloFactura.idUsuario = req.params.ID;
            modeloFactura.save((error, facturaAgregada) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al crear la factura." });
              return res
                .status(200)
                .send({ Mi_factura: facturaAgregada, Exito: cuartoOcupado });
            });
          }
        );
      }
    }
  });
}

function pagarServicio(req, res) {
  Facturas.find({ idUsuario: req.params.ID }, (error, facturaEncontrada) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al buscar facturas del usuario." });
    if (facturaEncontrada) {
      Facturas.findOneAndUpdate(
        { idUsuario: req.params.ID },
        { $inc: { total: req.params.precio * 1 } },
        { new: true },
        (error, facturaActualizada) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al actualizar el precio de la factura" });
          return res
            .status(200)
            .send({ Precio_actualizado: facturaActualizada });
        }
      );
    } else {
      return res.status(500).send({
        Error:
          "Para contratar un servicio primero debes rentar una habitación.",
      });
    }
  });
}

function verHabitacion(req, res) {
  Habitaciones.findById(
    { _id: req.params.ID },
    (error, habitacionEncontrada) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al obtener la habitacion." });
      return res.status(200).send({ Cuarto: habitacionEncontrada });
    }
  );
}

function eliminarPerfilUsuario(req, res) {
  Usuarios.findByIdAndDelete(
    { _id: req.params.ID, rol: "USUARIO" },
    (error, perfilBorrado) => {
      if (error)
        return res.status(500).send({ Error: "Erro al borrar el perfil." });
    }
  );
}

function cancelarReservacion(req, res) {
  Habitaciones.findByIdAndUpdate(
    { _id: req.params.ID },
    { disponibilidad: "DISPONIBLE", verificar: true, idUsuario: null },
    { new: true },
    (error, reservacionCancelada) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al cancelar la reservacion." });
      return res.status(200).send({ Exito: reservacionCancelada });
    }
  );
}

function reservaciones(req, res) {
  Habitaciones.find({ idUsuario: req.params.ID }, (error, misReservas) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener reservaciones." });
    return res.status(200).send({ Reservas: misReservas });
  }).populate("idHotel nombre");
}

module.exports = {
  editar,
  obtenerId,
  verHotel,
  pagarHabitacion,
  verHabitacion,
  reservaciones,
  cancelarReservacion,
};
