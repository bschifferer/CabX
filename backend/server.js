var express = require('express')
var request = require('request');
var app = express()

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

app.listen(3000)

