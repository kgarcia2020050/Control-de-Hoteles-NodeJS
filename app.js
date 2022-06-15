const express = require('express');
const cors = require('cors');
var app = express();

const rutasInicio = require('./src/routes/usuario.route');
const rutasHotel=require("./src/routes/hotel.route")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api',rutasInicio,rutasHotel);


module.exports = app;