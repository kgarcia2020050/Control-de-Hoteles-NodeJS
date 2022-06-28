const Usuarios = require("../models/usuario.model");
const Habitaciones = require("../models/habitacion.model");
const Facturas = require("../models/factura.model");
const Eventos = require("../models/evento.model");

const Historiales = require("../models/historial.model");

function agregarEvento(req, res) {
  var datos = req.body;
  if (
    datos.nombre == "" ||
    datos.lugar == "" ||
    datos.fecha == "" ||
    datos.descripcion == ""
  ) {
    return res.status(500).send({ Error: "Debes llenar todos los campos." });
  } else {
    Eventos.findOne(
      { idHotel: req.params.ID, nombre: datos.nombre },
      (error, eventoEncontrado) => {
        if (error)
          return res.status(500).send({ Error: "Error al obtener el evento." });
        if (eventoEncontrado) {
          console.log(eventoEncontrado);
          return res
            .status(500)
            .send({ Error: "Ya organizaste un evento con el mismo nombre." });
        } else {
          Eventos.create(
            {
              idHotel: req.params.ID,
              nombre: datos.nombre,
              lugar: datos.lugar,
              descripcion: datos.descripcion,
              fecha: datos.fecha,
            },
            (error, eventoCreado) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al crear el evento." });
              return res.status(200).send({ Evento: eventoCreado });
            }
          );
        }
      }
    );
  }
}

function verEventos(req, res) {
  Eventos.find({ idHotel: req.params.ID }, (error, misEventos) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al obtener el listado de eventos." });
    return res.status(200).send({ Eventos: misEventos });
  });
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
      return res.status(500).send({ Error: "Error al buscar la factura." });
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
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al modificar el cuarto." });
          Facturas.findByIdAndUpdate(
            { _id: facturaEncontrada._id },
            {
              $push: {
                factura: {
                  compra: cuartoOcupado.nombre,
                  precio: cuartoOcupado.precio * req.params.dias,
                },
              },
            },
            { new: true },
            (error, facturaActualizada) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al actualizar la factura." });
              var totalFactura = 0;

              for (var i = 0; i < facturaActualizada.factura.length; i++) {
                totalFactura =
                  totalFactura + facturaActualizada.factura[i].precio;
              }
              Facturas.findByIdAndUpdate(
                { _id: facturaEncontrada._id },
                { total: totalFactura },
                (error, totalActualizado) => {
                  if (error)
                    return res.status(500).send({
                      Error: "Error al actualizar el total de la factura.",
                    });
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
                      Historiales.findOne(
                        {
                          idUsuario: req.params.ID,
                          idHotel: cuartoOcupado.idHotel,
                        },
                        (error, historialExistente) => {
                          if (error)
                            return res.status(500).send({
                              Error: "Error al obtener el historial.",
                            });
                          if (historialExistente) {
                            return res.status(200).send({
                              Precio_actualizado: facturaActualizada,
                              aumento: hotelSolicitado,
                              factura: facturaActualizada,
                            });
                          } else {
                            Historiales.create(
                              {
                                idUsuario: req.params.ID,
                                idHotel: cuartoOcupado.idHotel,
                              },

                              (error, historialCreado) => {
                                if (error)
                                  return res.status(500).send({
                                    Error: "Error al crear el historial.",
                                  });
                                return res.status(200).send({
                                  Precio_actualizado: facturaActualizada,
                                  aumento: hotelSolicitado,
                                  factura: facturaActualizada,
                                  historial: historialCreado,
                                });
                              }
                            );
                          }
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } else {
      Habitaciones.findByIdAndUpdate(
        { _id: req.params.cuarto },
        {
          disponibilidad: "RESERVADA",
          verificar: false,
          idUsuario: req.params.ID,
        },
        (error, cuartoOcupado) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al modificar el cuarto." });

          Facturas.create(
            {
              idUsuario: req.params.ID,
              factura: {
                compra: cuartoOcupado.nombre,
                precio: cuartoOcupado.precio * req.params.dias,
              },
              total: cuartoOcupado.precio * req.params.dias,
            },
            (error, facturaCreada) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al crear la factura." });

              Usuarios.findByIdAndUpdate(
                { _id: cuartoOcupado.idHotel },
                { $inc: { solicitado: 2 * 1 } },
                { new: true },
                (error, hotelSolicitado) => {
                  if (error)
                    return res
                      .status(500)
                      .send({ Error: "Error al modificar el hotel." });
                  Historiales.create(
                    {
                      idUsuario: req.params.ID,
                      idHotel: cuartoOcupado.idHotel,
                    },
                    (error, historialCreado) => {
                      if (error)
                        return res.status(500).send({
                          Error: "Error al crear el historial.",
                        });
                      return res.status(200).send({
                        aumento: hotelSolicitado,
                        factura: {},
                        historial: historialCreado,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
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

function editarHotel(req, res) {
  var datos = req.body;
  Usuarios.findByIdAndUpdate(
    { _id: req.params.ID },
    datos,
    { new: true },
    (error, hotelEditado) => {
      if (error)
        return res.status(500).send({ Error: "Error al editar el hotel." });
      return res.status(200).send({ Modificado: hotelEditado });
    }
  );
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
  editarHotel,
  agregarEvento,
  verEventos,
};
