const request = require('request');

const PRE_URL = 'https://dev.virtualearth.net/REST/v1/Locations/US/';
const POST_URL = '?o=json&key=';
const BING_KEY = 'AjpMdmorYvx_955ltPZVK1BNYpGA0Dl8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f';

function requestLatLongFromAddress(sAddress) {
  request(PRE_URL + encodeURIComponent(sAddress) + POST_URL + BING_KEY, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    processBingLatLongResponse(body);
  });
}

function processBingLatLongResponse(jsonResponses) {
  if (!jsonResponses.hasOwnProperty('resourceSets')) {
    return console.log('No resourceSets included in response');
  }
  if (!(jsonResponses.resourceSets)[0].hasOwnProperty('resources')) {
    return console.log('No resources included in response');
  }
  jsonResponsesBody = jsonResponses.resourceSets[0].resources;
  jsonProcessedResponses = [];
  for (i in jsonResponsesBody) {
    jsonProcessedResponses[i] = getRelevantInformationFromLatLongResponse(jsonResponsesBody[i])
  }
  console.log(jsonProcessedResponses);
}

function getRelevantInformationFromLatLongResponse(jsonResponseBody) {
  var jsonProcessedResponseBody = {
    name: jsonResponseBody.name,
    confidence: jsonResponseBody.confidence,
    lat: jsonResponseBody.geocodePoints[0].coordinates[0],
    long: jsonResponseBody.geocodePoints[0].coordinates[1],
    address: jsonResponseBody.address
  };
  return jsonProcessedResponseBody;
}
