const Usuarios = require("../models/usuario.model");
const Habitaciones = require("../models/habitacion.model");
const Facturas = require("../models/factura.model");
const Eventos = require("../models/evento.model");

const Historiales = require("../models/historial.model");

function agregarEvento(req, res) {
  var datos = req.body;
  if (datos.nombre == "" || datos.lugar == "" || datos.fecha)
    Eventos.find(
      { idHotel: req.params.ID, nombre: datos.nombre },
      (error, eventoEncontrado) => {
        if (error)
          return res.status(500).send({ Error: "Error al obtener el evento." });
        if (eventoEncontrado) {
          return res
            .status(500)
            .send({ Error: "Ya organizaste un evento con el mismo nombre." });
        } else {
        }
      }
    );
}

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
          Historiales.findOne(
            {
              idUsuario: req.params.ID,
              idHotel: cuartoOcupado.idHotel,
            },
            (error, guardado) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al buscar el historial" });
              if (guardado) {
                Facturas.findOneAndUpdate(
                  { idUsuario: req.params.ID },
                  { $inc: { total: req.params.precio * 1 } },
                  { new: true },
                  (error, facturaActualizada) => {
                    if (error) {
                      return res.status(500).send({
                        Error: "Error al actualizar el precio de la factura",
                      });
                    }
                    Usuarios.findByIdAndUpdate(
                      { _id: cuartoOcupado.idHotel },
                      { $inc: { solicitado: 2 * 1 } },
                      { new: true },
                      (error, hotelSolicitado) => {
                        if (error)
                          return res.status(500).send({
                            Error:
                              "Error al modificar las solicitudes del hotel.",
                          });
                        return res.status(200).send({
                          Precio_actualizado: facturaActualizada,
                          aumento: hotelSolicitado,
                        });
                      }
                    );
                  }
                );
              } else {
                Facturas.findOneAndUpdate(
                  { idUsuario: req.params.ID },
                  { $inc: { total: req.params.precio * 1 } },
                  { new: true },
                  (error, facturaActualizada) => {
                    if (error) {
                      return res.status(500).send({
                        Error: "Error al actualizar el precio de la factura",
                      });
                    }
                    Usuarios.findByIdAndUpdate(
                      { _id: cuartoOcupado.idHotel },
                      { $inc: { solicitado: 2 * 1 } },
                      { new: true },
                      (error, hotelSolicitado) => {
                        if (error)
                          return res.status(500).send({
                            Error:
                              "Error al modificar las solicitudes del hotel.",
                          });
                        var modeloHistorial = new Historiales();
                        modeloHistorial.idUsuario = req.params.ID;
                        modeloHistorial.idHotel = cuartoOcupado.idHotel;
                        modeloHistorial.save((error, historialGuardado) => {
                          if (error)
                            return res.status(500).send({
                              Error: "Error al actualizar el historial.",
                            });
                          return res.status(200).send({
                            Precio_actualizado: facturaActualizada,
                            aumento: hotelSolicitado,
                            actualizado: historialGuardado,
                          });
                        });
                      }
                    );
                  }
                );
              }
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
          {
            disponibilidad: "RESERVADA",
            verificar: false,
            idUsuario: req.params.ID,
          },
          { new: true },
          (error, cuartoOcupado) => {
            if (error)
              return res
                .status(500)
                .send({ Error: "Error al obtener el cuarto" });
            Usuarios.findByIdAndUpdate(
              { _id: cuartoOcupado.idHotel },
              { $inc: { solicitado: 2 * 1 } },
              { new: true },
              (error, solicitado) => {
                if (error)
                  return res.status(500).send({
                    Error: "Error al modificar las solicitudes del hotel.",
                  });
                var modeloFactura = new Facturas();
                modeloFactura.total = req.params.precio;
                modeloFactura.idUsuario = req.params.ID;
                modeloFactura.save((error, facturaAgregada) => {
                  if (error)
                    return res
                      .status(500)
                      .send({ Error: "Error al crear la factura." });
                  Historiales.findOne(
                    {
                      idUsuario: req.params.ID,
                      idHotel: cuartoOcupado.idHotel,
                    },
                    (error, historial) => {
                      if (error)
                        return res
                          .status(500)
                          .send({ Error: "Error al verificar el historial" });
                      if (historial) {
                        return res.status(200).send({
                          Mi_factura: facturaAgregada,
                          Exito: cuartoOcupado,
                          historialHotel: historial,
                        });
                      } else {
                        var modeloHistorial = new Historiales();
                        modeloHistorial.idUsuario = req.params.ID;
                        modeloHistorial.idHotel = cuartoOcupado.idHotel;
                        modeloHistorial.save((error, historialGuardado) => {
                          if (error)
                            return res.status(500).send({
                              Error: "Error al agregar el historial.",
                            });
                          return res.status(200).send({
                            Mi_factura: facturaAgregada,
                            Exito: cuartoOcupado,
                            historialHotel: historialGuardado,
                          });
                        });
                      }
                    }
                  );
                });
              }
            );
          }
        );
      }
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
  Habitaciones.updateMany(
    { idUsuario: req.params.ID },
    { disponibilidad: "DISPONIBLE", verificar: true, idUsuario: null },
    (error, modificado) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al cambiar el estado de las habitaciones" });
      Usuarios.findByIdAndDelete(
        { _id: req.params.ID, rol: "USUARIO" },
        (error, perfilBorrado) => {
          if (error)
            return res.status(500).send({ Error: "Erro al borrar el perfil." });
          return res.status(200).send({ Exito: "Perfil borrado." });
        }
      );
    }
  );
  /*       Facturas.findByIdAndDelete(
        { idUsuario: req.params.ID },
        (error, facturasBorradas) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al buscar facturas del usuario." }); */
  /*         }
      ); */
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
  }).populate("idHotel", " nombre");
}

function verHistorial(req, res) {
  Historiales.find({ idUsuario: req.params.ID }, (error, miHistorial) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener el historial." });
    if (!miHistorial)
      return res
        .status(500)
        .send({ Error: "No te has hospedado en ningun hotel." });
    return res.status(200).send({ Historial: miHistorial });
  }).populate("idHotel", "nombre");
}

module.exports = {
  editar,
  obtenerId,
  verHotel,
  pagarHabitacion,
  verHabitacion,
  reservaciones,
  cancelarReservacion,
  eliminarPerfilUsuario,
  verHistorial,
};
