var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var rideFinder = require('./src/getFindRides.js');
var users = require('./src/users.js');

app.use(bodyParser.json());

app.post('/findRides/', async function(req, res) {
  sAddressFrom = req.body.from;
  sAddressTo = req.body.to;
  response = await rideFinder.findRides(sAddressFrom, sAddressTo);
  fromName = response.fromName;
  toName = response.toName;
  if (req.body.hasOwnProperty('userid')) {
  	userid = req.body.userid;
  	users.insertSearchHistory(userid, fromName, toName);
  }
  res.send(response.res);
})

app.post('/createUser/', async function(req, res) {
  sUsername = req.body.username;
  sEmail = req.body.email;
  response = await users.createUser(sUsername, sEmail);
  res.send(response);
})

app.post('/getFromSearchHistoryByUser/', async function(req, res) {
  userid = req.body.userid;
  maxResults = req.body.maxresults;
  response = await users.getFromSearchHistoryByUserId(userid, maxResults);
  res.send(response);
})

app.post('/getToSearchHistoryByUser/', async function(req, res) {
  userid = req.body.userid;
  maxResults = req.body.maxresults;
  response = await users.getToSearchHistoryByUserId(userid, maxResults);
  res.send(response);
})

app.listen(3000);

