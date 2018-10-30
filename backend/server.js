var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var rideFinder = require('./src/getFindRides.js');

app.use(bodyParser.json());

app.post('/findRides/', async function(req, res) {
  sAddressFrom = req.body.from;
  sAddressTo = req.body.to;
  response = await rideFinder.findRides(sAddressFrom, sAddressTo);
  res.send(response);
})

app.listen(3000);

