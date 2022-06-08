const mongoose = require("mongoose");
const app = require("./app");
const admin = require("./src/controllers/inicio.controller");
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/Hoteles", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, function () {
      console.log("Conexion exitosa a la db");
      console.log("Corriendo en el puerto 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

admin.crearAdmin();
