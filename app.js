const express = require('express');
const cors = require('cors');
var app = express();

const rutasInicio = require('./src/routes/usuario.route');
const rutasHotel=require("./src/routes/hotel.route")
const rutasHabitacion=require("./src/routes/habitacion.route")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api',rutasInicio,rutasHotel,rutasHabitacion);


module.exports = app;