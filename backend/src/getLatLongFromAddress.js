const request = require('request');

const PRE_URL = 'https://dev.virtualearth.net/REST/v1/Locations/US/';
const POST_URL = '?o=json&key=';
const BING_KEY = 'AjpMdmorYvx_955ltPZVK1BNYpGA0Dl' +
  '8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f';

module.exports = {
  getRequestLatLongFromAddress: async function(sAddress) {
    let response = await requestLatLongFromAddress(sAddress);
    processedResponse = processBingLatLongResponse(response);
    return processedResponse;
  }
};

/**
 * Returns addresses based on a input address (string) with Lat and Loing.
 * @param {string} sAddress - Keyword for the address
 */
function requestLatLongFromAddress(sAddress) {
  return new Promise(function (resolve, reject) {
  request(PRE_URL + encodeURIComponent(sAddress) + POST_URL + BING_KEY,
      {json: true}, (err, res, body) => {
        if (err) {
          reject(err);
        }
      resolve(body);
      });
  });
}

/**
 * Process the response of a geocoding search with Bing
 * @param {jsonObject} jsonResponses - jsonObject of the response from bing
 * @return {string} error msg
 */
function processBingLatLongResponse(jsonResponses) {
  if (!jsonResponses.hasOwnProperty('resourceSets')) {
    return console.log('No resourceSets included in response');
  }
  if (!(jsonResponses.resourceSets)[0].hasOwnProperty('resources')) {
    return console.log('No resources included in response');
  }
  let jsonResponsesBody = jsonResponses.resourceSets[0].resources;
  let jsonProcessedResponses = processBingResponseBody(jsonResponsesBody);
  return(jsonProcessedResponses);
}

/**
 * Process the response body of a geocoding search with Bing
 * @param {string} jsonResponsesBody - jsonObject - part of Bing response
 * @return {jsonObject} jsonProcessedResponses
 */
function processBingResponseBody(jsonResponsesBody) {
  jsonProcessedResponses = [];
  for (let i=0; i<jsonResponsesBody.length; i++) {
    jsonProcessedResponses[i] = getRelevantInformationFromLatLongResponse(
        jsonResponsesBody[i]);
  }
  return jsonProcessedResponses;
}

/**
 * Process a single search result and extract only relevant information
 * @param {jsonObject} jsonResponseBody -  single search result
 * @return {jsonObject} jsonProcessedResponseBody - single processed response
 */
function getRelevantInformationFromLatLongResponse(jsonResponseBody) {
  let jsonProcessedResponseBody = {
    name: jsonResponseBody.name,
    confidence: jsonResponseBody.confidence,
    lat: jsonResponseBody.geocodePoints[0].coordinates[0],
    long: jsonResponseBody.geocodePoints[0].coordinates[1],
    address: jsonResponseBody.address
  };
  return jsonProcessedResponseBody;
}
