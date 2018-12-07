const request = require('request');

const PRE_URL = 'https://dev.virtualearth.net/REST/v1/Locations/US/';
const POST_URL = '?o=json&key=';
const BING_KEY = 'AjpMdmorYvx_955ltPZVK1BNYpGA0Dl' +
  '8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f';

exports.getRequestLatLongFromAddress = async function(sAddress) {
  let res = {};
  res['response'] = await module.exports.requestLatLongFromAddress(sAddress)
      .catch((err) => {
        console.error(err);
        res['error'] = err;
      });
  if (!res.hasOwnProperty('error')) {
    res['processedResponse'] =
      module.exports.processBingLatLongResponse(res['response']);
  }
  return (res);
};


/**
 * Returns addresses based on a input address (string) with Lat and Loing.
 * @param {string} sAddress - Keyword for the address
 * @return {string} jsonObject - Response body from Bing
 */
exports.requestLatLongFromAddress = function(sAddress) {
  return new Promise(function(resolve, reject) {
    request.get(PRE_URL + encodeURIComponent(sAddress) + POST_URL + BING_KEY,
        {json: true, timeout: 1500}, (err, res, body) => {
          if (err) {
            reject(err);
          } else if (res.statusCode != 200) {
            reject(res.statusCode);
          } else {
            resolve(body);
          }
        });
  });
};

/**
 * Process the response of a geocoding search with Bing
 * @param {jsonObject} jsonResponses - jsonObject of the response from bing
 * @return {jsonArray} jsonProcessedResponses - processed json array with
 */
exports.processBingLatLongResponse = function(jsonResponses) {
  let res = {};
  if (
    !(jsonResponses.hasOwnProperty('resourceSets')) ||
    !(jsonResponses.resourceSets[0].hasOwnProperty('resources'))
  ) {
    console.error(jsonResponses);
    console.error('does not include all required fields');
    res['error'] = 'Response does not include all required fields';
  } else {
    let jsonResponsesBody = jsonResponses.resourceSets[0].resources;
    res['jsonProcessedResponses'] = module.exports.processBingResponseBody(
        jsonResponsesBody);
  }
  return (res);
};

/**
 * Process the response body of a geocoding search with Bing
 * @param {string} jsonResponsesBody - jsonObject - part of Bing response
 * @return {jsonObject} jsonProcessedResponses
 */
exports.processBingResponseBody = function(jsonResponsesBody) {
  let jsonProcessedResponses = [];
  let j = 0;
  for (let i=0; i<jsonResponsesBody.length; i++) {
    let res = module.exports.getRelevantInformationFromLatLongResponse(
        jsonResponsesBody[i]);
    if (!res.hasOwnProperty('error')) {
      jsonProcessedResponses[j] = res['response'];
      j = j+1;
    }
  }
  return jsonProcessedResponses;
};

/**
 * Process a single search result and extract only relevant information
 * @param {jsonObject} jsonResponseBody -  single search result
 * @return {jsonObject} jsonProcessedResponseBody - single processed response
 */
exports.getRelevantInformationFromLatLongResponse = function(jsonResponseBody) {
  let res = {};
  if (
    !jsonResponseBody.hasOwnProperty('name') ||
    !jsonResponseBody.hasOwnProperty('confidence') ||
    !jsonResponseBody.hasOwnProperty('geocodePoints') ||
    !jsonResponseBody.hasOwnProperty('address') ||
    !jsonResponseBody.geocodePoints[0].hasOwnProperty('coordinates') ||
    !(jsonResponseBody.geocodePoints[0].coordinates.length == 2)
  ) {
    console.error(jsonResponseBody);
    console.error('does not include all required fields');
    res['error'] = 'Response does not include all required fields';
  } else {
    if (jsonResponseBody.confidence == 'Low') {
      res['error'] = 'Confidence is too low';
    } else {
      res['response'] = {
        name: jsonResponseBody.name,
        confidence: jsonResponseBody.confidence,
        lat: jsonResponseBody.geocodePoints[0].coordinates[0],
        long: jsonResponseBody.geocodePoints[0].coordinates[1],
        address: jsonResponseBody.address,
      };
    }
  }
  return (res);
};
