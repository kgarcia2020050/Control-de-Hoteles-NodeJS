const Usuarios = require("../models/usuario.model");
const Habitaciones = require("../models/habitacion.model");
const Facturas = require("../models/factura.model");
const Eventos = require("../models/evento.model");
const Servicios = require("../models/servicio.model");
const Historiales = require("../models/historial.model");

const Facturaciones = require("../models/facturacion.model");

function comprarServicio(req, res) {
  Habitaciones.findOne(
    { idHotel: req.params.service, idUsuario: req.params.ID },
    (error, reservacion) => {
      if (error)
        return res.status(500).send({ Error: "Error al comprar el servicio." });
      if (reservacion) {
        Servicios.findById(
          { _id: req.params.IdService },
          (error, servicioEncontrado) => {
            if (error)
              return res
                .status(500)
                .send({ Error: "Error al obtener el servicio." });
            Historiales.findOneAndUpdate(
              { idUsuario: req.params.ID },
              {
                $push: {
                  historial: {
                    nombre: servicioEncontrado.nombre,
                  },
                },
              },
              { new: true },
              (error, historialActualizad) => {
                if (error)
                  return res
                    .status(500)
                    .send({ Error: "Error al almacenar el historial." });
                Facturas.findOneAndUpdate(
                  { idUsuario: req.params.ID },
                  {
                    $push: {
                      factura: {
                        compra: servicioEncontrado.nombre,
                        precio: servicioEncontrado.precio,
                      },
                    },
                  },
                  { new: true },
                  (error, facturaActualizada) => {
                    if (error) {
                      console.log(facturaActualizada);
                      return res.status(500).send({
                        Error: "Error al actualizar la factura.",
                      });
                    }
                    var totalFactura = 0;
                    for (
                      var i = 0;
                      i < facturaActualizada.factura.length;
                      i++
                    ) {
                      totalFactura =
                        totalFactura + facturaActualizada.factura[i].precio;
                    }
                    Facturas.findOneAndUpdate(
                      { _id: facturaActualizada._id },
                      { total: totalFactura },
                      (error, totalActualizado) => {
                        if (error)
                          return res.status(500).send({
                            Error: "Error al actualizar el total.",
                          });
                        return res.status(200).send({
                          FacturaActualizada: facturaActualizada,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      } else {
        return res.status(500).send({
          Error:
            "Para adquirir el servicio debes de quedarte en una habitacion en nuestro hotel.",
        });
      }
    }
  );
}

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
  if (req.params.dias <= 0) {
    return res.status(500).send({ Error: "Debes quedarte al menos un dia." });
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
            .send({ Error: "Error al modificar el cuarto." });
        Facturas.findOneAndUpdate(
          { idUsuario: req.params.ID },
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
            Facturas.findOneAndUpdate(
              { idUsuario: req.params.ID },
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
                        Error: "Error al modificar las solicitudes del hotel.",
                      });
                    return res.status(200).send(hotelSolicitado);
                  }
                );
              }
            );
          }
        );
      }
    );
  }
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
      Habitaciones.find(
        { idUsuario: req.params.ID },
        (error, habitacionesEncontradas) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al obtener la habitacion." });
          if (habitacionesEncontradas) {
            Habitaciones.updateMany(
              { idUsuario: req.params.ID },
              {
                disponibilidad: "DISPONIBLE",
                verificar: true,
                idUsuario: null,
              },
              (error, modificado) => {
                if (error)
                  return res.status(500).send({
                    Error: "Error al cambiar el estado de las habitaciones",
                  });
              }
            );
          }
          Historiales.find(
            { idUsuario: req.params.ID },
            (error, historiales) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al obtener el historial." });
              if (historiales) {
                Historiales.deleteMany(
                  { idUsuario: req.params.ID },
                  (error, borrado) => {
                    if (error)
                      return res
                        .status(500)
                        .send({ Error: "Error al borrar el historial." });
                    return res.status(200).send({ Exito: "Perfil borrado." });
                  }
                );
              } else {
                return res.status(200).send({ Exito: "Perfil borrado." });
              }
            }
          );
        }
      );
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
  }).populate("idHotel", " nombre");
}

function verHistorial(req, res) {
  Historiales.findOne({ idUsuario: req.params.ID }, (error, miHistorial) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener el historial." });
    if (!miHistorial)
      return res
        .status(500)
        .send({ Error: "No te has hospedado en ningun hotel." });
    return res.status(200).send({ Historial: miHistorial });
  });
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

function verCompras(req, res) {
  Facturas.findOne({ idUsuario: req.params.ID }, (error, compras) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener las compras." });
    return res.status(200).send({ Compras: compras });
  });
}

function facturar(req, res) {
  Facturas.findOne({ idUsuario: req.params.ID }, (error, pagar) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener las facturas." });
    if (pagar) {
      Facturas.findOneAndUpdate(
        { idUsuario: req.params.ID },
        { $set: { factura: [] } },
        { new: true },
        (error, facturaVaciada) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al vaciar la factura." });
          Habitaciones.find(
            { idUsuario: req.params.ID },
            (error, habitacionesEncontradas) => {
              if (error)
                return res
                  .status(500)
                  .send({ Error: "Error al obterner las habitaciones" });
              if (habitacionesEncontradas) {
                Habitaciones.updateMany(
                  { idUsuario: req.params.ID },
                  {
                    disponibilidad: "DISPONIBLE",
                    verificar: true,
                    idUsuario: null,
                  },
                  (error, modificado) => {
                    if (error)
                      return res.status(500).send({
                        Error: "Error al cambiar el estado de las habitaciones",
                      });
                  }
                );
              }
              return res.status(200).send({ Cobrado: "Pagos realizados" });
            }
          );
        }
      );
    } else {
      return res
        .status(500)
        .send({ Error: "No has realizado ninguna compra." });
    }
  });
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
  comprarServicio,
  verCompras,
  facturar,
};
