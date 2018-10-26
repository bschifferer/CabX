var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var latLong = require('./src/getLatLongFromAddress.js');
var lyft = require('./src/getLyft.js');
var uber = require('./src/getUber.js');


app.use(bodyParser.json());

app.post('/findRides/', async function (req, res) {
  jsonFromResults = await latLong.getRequestLatLongFromAddress(req.body.from);
  jsonToResults = await latLong.getRequestLatLongFromAddress(req.body.to);

  from_lat = jsonFromResults[0].lat
  from_long = jsonFromResults[0].long
  to_lat = jsonToResults[0].lat
  to_long = jsonToResults[0].long

  jsonUber = await uber.getUberPrices(from_lat, from_long, to_lat, to_long)
  jsonLyft = await lyft.getLyftPrices(from_lat, from_long, to_lat, to_long)

  response = jsonUber.concat(jsonLyft);
  res.send(response);
})

app.listen(3000)

