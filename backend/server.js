var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var rideFinder = require('./src/getFindRides.js');
var suggestion = require('./src/getSuggestion.js');

app.use(bodyParser.json());

app.post('/findRides/', async function(req, res) {
  response = {};
  if (!req.hasOwnProperty('body')) {
  	response['error'] = 'Invalid request';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('from')) {
  	response['error'] = 'From address is missing';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('to')) {
  	response['error'] = 'To address is missing';
    return (res.send(response));
  }
  sAddressFrom = req.body.from;
  sAddressTo = req.body.to;
  response = await rideFinder.findRides(sAddressFrom, sAddressTo);
  if (response.hasOwnProperty('error')) {
    res.send(response);
  } else {
  	fromName = response.fromName;
    toName = response.toName;
    if (!req.body.hasOwnProperty('withMeta')) {
        res.send(response.res);
    } else {
        res.send({results: response.res, to: response.to, from: response.from});
    }
  }
})

app.post('/suggestion/', async function(req, res) {
  sAddress = req.body.suggestion;
  response = await suggestion.getSuggestion(sAddress);
  res.send(response.response);
})

app.listen(3000);

