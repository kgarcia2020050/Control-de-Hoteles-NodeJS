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
    datos.verificar == null ||
    datos.direccion == null ||
    datos.cuartos == null ||
    datos.gerente == null
  ) {
    return res.status(500).send({ Error: "Debes llenar todos los campos." });
  } else {
    if (datos.password != datos.verificar) {
      return res.status(500).send({ Error: "Las claves no coinciden." });
    } else {
      Usuarios.findOne(
        {
          rol: "HOTEL",
          nombre: { $regex: datos.nombre, $options: "i" },
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
}

function usuariosRegistrados(req,res){
  Usuarios.find({rol:"USUARIO"},(error,usuarios)=>{
    if(error)return res.status(500).send({Error:"Error en la peticion."})
    return res.status(200).send({Usuarios:usuarios})
  })
}


function borrarHotel(req, res) {
  Habitaciones.deleteMany(
    { idHotel: req.params.ID },
    (error, cuartosBorrados) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al eliminar las habitaciones del hotel." });
      Usuarios.findByIdAndDelete(
        { _id: req.params.ID, rol: "HOTEL" },
        (error, hotelEliminado) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al eliminar al hotel." });
          if (!hotelEliminado)
            return res
              .status(500)
              .send({ Error: "No se pudo eliminar al hotel." });
          return res
            .status(200)
            .send({ Hotel_eliminado: "Hotel eliminado correctamente." });
        }
      );
    }
  );
}

function verHoteles(req, res) {
  Usuarios.find({ rol: "HOTEL" }, (error, hoteles) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener hoteles." });
    if (!hoteles) return res.status(404).send("No hay hoteles registrados.");
    return res.status(200).send({Hoteles:hoteles})
  });
}


module.exports={
    borrarHotel,
    nuevoHotel,
    verHoteles,
    usuariosRegistrados
}