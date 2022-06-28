const Usuarios = require("../models/usuario.model");

const Habitaciones = require("../models/habitacion.model");
const { response } = require("express");

function agregarHabitacion(req, res) {
  var datos = req.body;
  if (
    datos.nombre == "" ||
    datos.descripcion == "" ||
    datos.espacio == "" ||
    datos.precio == ""
  ) {
    return res.status(404).send({ Error: "Debes llenar todos los campos." });
  } else {
    Usuarios.findById({ _id: req.params.ID }, (error, hotelEncontrado) => {
      if (hotelEncontrado.cuartos == 0) {
        return res
          .status(500)
          .send({ Error: "Ya has llegado al limite de habitaciones." });
      } else {
        Habitaciones.findOne(
          { idHotel: req.params.ID, nombre: datos.nombre },
          (error, habitacionExistente) => {
            if (habitacionExistente) {
              return res
                .status(500)
                .send({ Error: "Ya hay una habitacion con el mismo nombre." });
            } else {
              Usuarios.findByIdAndUpdate(
                { _id: req.params.ID },
                { $inc: { cuartos: 1 * -1 } },
                (error, hotelActualizado) => {
                  if (error)
                    return res.status(500).send({
                      Error: "Error al modificar la cantidad de habitaciones.",
                    });
                  if (!hotelActualizado)
                    return res.status(500).send({
                      Error: "No se pudo modificar el total de habitaciones.",
                    });

                  console.log(hotelEncontrado.cuartos);
                  var modelo = new Habitaciones();
                  modelo.nombre = datos.nombre;
                  modelo.espacio = datos.espacio;
                  modelo.verificar = true;
                  modelo.precio = datos.precio;
                  modelo.descripcion=datos.descripcion;
                  modelo.disponibilidad = "DISPONIBLE";
                  modelo.idHotel = req.params.ID;
                  modelo.save((error, habitacionAgregada) => {
                    if (error)
                      return res
                        .status(500)
                        .send({ Error: "Error al agregar la habitacion." });
                    if (!habitacionAgregada)
                      return res
                        .status(500)
                        .send({ Error: "No se pudo agregar la habitacion." });
                    return res
                      .status(200)
                      .send({ Nueva_habitacion: habitacionAgregada });
                  });
                }
              );
            }
          }
        );
      }
    });
  }
}

function verHabitaciones(req, res) {
  Habitaciones.find({ idHotel: req.params.ID }, (error, misHabitaciones) => {
    if (error)
      return res
        .status(404)
        .send({ Error: "Error al cargar los habitaciones." });
    if (!misHabitaciones)
      return res
        .status(500)
        .send({ Error: "No hay habitaciones en este hotel." });
    return res.status(200).send({ Mis_habitaciones: misHabitaciones });
  }).populate("idUsuario nombre");
}

function modificarHabitacion(req, res) {
  var datos = req.body;
  Habitaciones.findByIdAndUpdate(
    { _id: req.params.ID },
    datos,
    { new: true },
    (error, cuartoEditado) => {
      if (error)
        return res.status(500).send({ Error: "Error al editar el cuarto" });
      return res.status(200).send({ Editado: cuartoEditado });
    }
  );
}

function habitacionID(req, res) {
  Habitaciones.findById({ _id: req.params.ID }, (error, cuartoEncontrado) => {
    if (error)
      return res.status(500).send({ Error: "Error al buscar el cuarto" });
    return res.status(200).send({ Cuarto: cuartoEncontrado });
  });
}

module.exports = {
  agregarHabitacion,
  verHabitaciones,
  modificarHabitacion,
  habitacionID,
};
