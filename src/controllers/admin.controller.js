const encriptar = require("bcrypt-nodejs");
const e = require("cors");
const { response } = require("express");
const Usuarios = require("../models/usuario.model");

const Habitaciones = require("../models/habitacion.model");

function nuevoHotel(req, res) {
  var datos = req.body;
  if (
    datos.nombre == null ||
    datos.email == null ||
    datos.password == null ||
    datos.direccion == null ||
    datos.cuartos == null ||
    datos.gerente == null
  ) {
    return res.status(500).send({ Error: "Debes llenar todos los campos." });
  } else {
    Usuarios.findOne(
      {
        rol: "HOTEL",
        nombre: datos.nombre,
      },
      (error, hotelExistente) => {
        if (hotelExistente) {
          return res
            .status(500)
            .send({ Error: "Ya hay un hotel con el mismo nombre." });
        } else {
          var modelo = new Usuarios();
          modelo.nombre = datos.nombre;
          modelo.email = datos.email;
          modelo.direccion = datos.direccion;
          modelo.cuartos = datos.cuartos;
          modelo.gerente = datos.gerente;
          modelo.telefono=datos.telefono;
          modelo.rol = "HOTEL";
          encriptar.hash(
            datos.password,
            null,
            null,
            (error, claveEncriptada) => {
              modelo.password = claveEncriptada;
              modelo.save((error, nuevoHotel) => {
                if (error)
                  return res.status(404).send({ Error: "Hubo un error." });
                if (!nuevoHotel)
                  return res
                    .status(500)
                    .send({ Error: "No se pudo guardar al hotel." });
                return res
                  .status(200)
                  .send({ Nuevo_hotel: "Hotel agregado exitosamente." });
              });
            }
          );
        }
      }
    );
  }
}

function usuariosRegistrados(req, res) {
  Usuarios.find({ rol: "USUARIO" }, (error, usuarios) => {
    if (error) return res.status(500).send({ Error: "Error en la peticion." });
    return res.status(200).send({ Usuarios: usuarios });
  });
}


function verHoteles(req, res) {
  Usuarios.find({ rol: "HOTEL" }, (error, hoteles) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener hoteles." });
    if (!hoteles) return res.status(404).send("No hay hoteles registrados.");
    return res.status(200).send({ Hoteles: hoteles });
  });
}

function hotelesMasSolicitados(req, res) {
  Usuarios.find({ solicitado: { $gt: 1 } }, (error, masSolicitados) => {
    if (error) return res.status(500).send({ Error: "Error en la peticion" });
    if (masSolicitados.length == 0)
      return res
        .status(200)
        .send({ Hoteles_solicitados: "No hay hoteles muy populares ahora." });
    return res.status(200).send({ Hoteles_solicitados: masSolicitados });
  }).sort({ solicitado: -1 });
}

module.exports = {
  nuevoHotel,
  verHoteles,
  usuariosRegistrados,
  hotelesMasSolicitados,
};
