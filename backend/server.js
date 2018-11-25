var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var rideFinder = require('./src/getFindRides.js');
var users = require('./src/users.js');

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
  fromName = response.fromName;
  toName = response.toName;
  if (req.body.hasOwnProperty('userid') && !(res.hasOwnProperty('error'))) {
  	userid = req.body.userid;
  	users.insertSearchHistory(userid, fromName, toName);
  }
  res.send(response.res);
})

app.post('/createUser/', async function(req, res) {	
  response = {};
  if (!req.hasOwnProperty('body')) {
  	response['error'] = 'Invalid request';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('username')) {
  	response['error'] = 'Username is missing';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('email')) {
  	sEmail = '';
  } else {
  	sEmail = req.body.email;
  }
  sUsername = req.body.username;
  response = await users.createUser(sUsername, sEmail);
  res.send(response);
})

app.post('/getUserIdByName/', async function(req, res) {
  response = {};
  if (!req.hasOwnProperty('body')) {
  	response['error'] = 'Invalid request';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('username')) {
  	response['error'] = 'Username is missing';
    return (res.send(response));
  }
  sUsername = req.body.username;
  response = await users.getUserIdByName(sUsername);
  res.send(response);
})

app.post('/getFromSearchHistoryByUser/', async function(req, res) {
  response = {};
  if (!req.hasOwnProperty('body')) {
  	response['error'] = 'Invalid request';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('userid')) {
  	response['error'] = 'Userid is missing';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('maxresults')) {
  	response['error'] = 'Maxresults is missing';
    return (res.send(response));
  }
  userid = req.body.userid;
  maxResults = req.body.maxresults;
  response = await users.getFromSearchHistoryByUserId(userid, maxResults);
  res.send(response);
})

app.post('/getToSearchHistoryByUser/', async function(req, res) {
  response = {};
  if (!req.hasOwnProperty('body')) {
  	response['error'] = 'Invalid request';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('userid')) {
  	response['error'] = 'Userid is missing';
    return (res.send(response));
  }
  if (!req.body.hasOwnProperty('maxresults')) {
  	response['error'] = 'Maxresults is missing';
    return (res.send(response));
  }
  userid = req.body.userid;
  maxResults = req.body.maxresults;
  response = await users.getToSearchHistoryByUserId(userid, maxResults);
  res.send(response);
})

app.listen(3000);

