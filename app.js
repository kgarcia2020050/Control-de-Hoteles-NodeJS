const express = require('express');
const cors = require('cors');
var app = express();

const rutasInicio = require('./src/routes/usuario.route');
//const rutasEmpresas= require('./src/routes/CRUDAdmin');
//const rutasSucursales=require("./src/routes/CRUDSucursales")
//const rutasProductos= require('./src/routes/CRUDProductos');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api',rutasInicio);


module.exports = app;