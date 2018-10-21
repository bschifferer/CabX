var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var latLong = require('./src/getLatLongFromAddress.js');
var lyft = require('./src/getLyft.js');
var uber = require('./src/getUber.js');

app.get('/uber', function(req, res) {
	var options = {
		url: 'https://api.uber.com/v1.2/estimates/price?start_latitude=37.7752315&start_longitude=-122.418075&end_latitude=37.7752415&end_longitude=-122.518075',
		headers: {
    		'User-Agent': 'request',
			'Authorization': 'Token cds-RMpAWPazEskuTK1gWxP7EAl_vyvBmT4jjKnY',
			'Accept-Language': 'en_US',
			'Content-Type': 'application/json'
  		}
	}
	request.get(options, function (error, response, body) {
		res.send(JSON.stringify(response.body), null, '\t');
	});
})

app.get('/lyft', function(req, res) {
	var options = {
		url: 'https://api.lyft.com/v1/cost?start_lat=37.7763&start_lng=-122.3918&end_lat=37.7972&end_lng=-122.4533',
		headers: {
			'Authorization': 'bearer sG1iQES+ARRImYkpZAQZ7PnTJEBv8e7tRHG6E1AZWCtOr7aYO64C6BUhHbTav3p7JiMwA84pIYOCvYHQo+POUMfAIYFVkjbaqEhgcvzx3MOSiteK1Cxb+oE='
  		}
	}
	request.get(options, function (error, response, body) {
		res.send(JSON.stringify(response.body), null, '\t');
	});

})

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

