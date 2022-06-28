const encriptar = require("bcrypt-nodejs");
const Usuarios = require("../models/usuario.model");
const jwt = require("../service/jwt");

function crearAdmin() {
  Usuarios.findOne({ rol: "ADMIN" }, (error, adminHallado) => {
    if (adminHallado == null) {
      var modeloUsuario = new Usuarios();
      modeloUsuario.nombre = "Administrador";
      modeloUsuario.email = "ADMIN";
      modeloUsuario.rol = "ADMIN";
      encriptar.hash("123456", null, null, (error, claveEncriptada) => {
        modeloUsuario.password = claveEncriptada;
        modeloUsuario.save((error, adminGuardado) => {
          if (error) console.log("Error en la peticion de crear usuario.");
          if (!adminGuardado) console.log("No se pudo crear al administrador.");
          console.log("Administrador: " + adminGuardado);
        });
      });
    } else {
      console.log("El administrador ya existe, sus datos son: " + adminHallado);
    }
  });
}

function registroUsuarios(req, res) {
  var datos = req.body;
  if (datos.nombre == null || datos.email == null || datos.password == null) {
    return res.status(500).send({ Error: "Debes llenar todos los datos." });
  } else {
    Usuarios.findOne({ email: datos.email }, (error, correoExistente) => {
      if (error)
        return res
          .status(404)
          .send({ Error: "Error al procesar la peticion." });
      if (correoExistente) {
        return res
          .status(500)
          .send({ Error: "Ya hay un usuario registrado con este correo." });
      } else {
        var modeloUsuario = new Usuarios();
        modeloUsuario.nombre = datos.nombre;
        modeloUsuario.email = datos.email;
        modeloUsuario.rol = "USUARIO";
        modeloUsuario.telefono=datos.telefono;
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          modeloUsuario.password = claveEncriptada;
          modeloUsuario.save((error, nuevoUsuario) => {
            if (error)
              return res.status(404).send({ Error: "Error en la peticion." });
            if (!nuevoUsuario)
              return res
                .status(500)
                .send({ Error: "No te pudiste registrar." });
            return res
              .status(200)
              .send({ Exito: "Te has registrado exitosamente." });
          });
        });
      }
    });
  }
}

function Login(req, res) {
  var datos = req.body;
  if (datos.email == null || datos.password == null) {
    return res.status(500).send({ Error: "Debes llenar todos los datos." });
  } else {
    Usuarios.findOne({ email: datos.email }, (error, usuarioEncontrado) => {
      if (error)
        return res.status(500).send({ Error: "Error en la peticion." });
      if (usuarioEncontrado) {
        encriptar.compare(
          datos.password,
          usuarioEncontrado.password,
          (error, verificado) => {
            if (verificado) {
              if (datos.obtenerToken == "true") {
                return res
                  .status(200)
                  .send({ Token: jwt.crearToken(usuarioEncontrado) });
              } else {
                usuarioEncontrado.password = undefined;
                return res
                  .status(200)
                  .send({ Inicio_exitoso: usuarioEncontrado });
              }
            } else {
              return res.status(500).send({ Error: "La clave no coincide." });
            }
          }
        );
      } else {
        return res
          .status(500)
          .send({ Error: "Los datos que ingresaste no existen." });
      }
    });
  }
}

module.exports = {
  crearAdmin,
  registroUsuarios,
  Login,
};
