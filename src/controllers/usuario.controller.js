const Usuarios = require("../models/usuario.model");



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

module.exports = {
  editar,
  obtenerId,
};
