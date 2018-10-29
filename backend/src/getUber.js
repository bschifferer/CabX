const request = require('request');

const PRE_URL_UBER = 'https://api.uber.com/v1.2/estimates/price?';


exports.getUberPrices = async function(fromLat, fromLong, toLat, toLong) {
  let response = await module.exports.uberPrices(fromLat, fromLong,
      toLat, toLong);
  processedResponses = module.exports.processUberResponseBody(
      JSON.parse(response).prices);
  return processedResponses;
};

/**
 * Returns the ride sharing offers from Uber based on From/To destination in
 * lat and long format
 * @param {integer} fromLat - Latitude value of from destination
 * @param {integer} fromLong - Longitude value of from destination
 * @param {integer} toLat - Latitude value of from destination
 * @param {integer} toLong - Longitude value of from destination
 * @return {jsonObject} fromLat - Response body from Uber
 */
exports.uberPrices = function(fromLat, fromLong, toLat, toLong) {
  var options = {
    url: PRE_URL_UBER + 'start_latitude=' + fromLat + '&start_longitude=' +
      fromLong + '&end_latitude=' + toLat + '&end_longitude=' + toLong,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Token cds-RMpAWPazEskuTK1gWxP7EAl_vyvBmT4jjKnY',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json',
    },
  };
  return new Promise(function(resolve, reject) {
    request.get(options, function(error, response, body) {
      resolve(body);
    });
  });
};

/**
 * Process the response body of a ride offer search with Uber
 * @param {string} jsonResponsesBody - jsonObject - part of Uber response
 * @return {jsonObject} jsonProcessedResponses - Processed responses as JSON
 */
exports.processUberResponseBody = function(jsonResponsesBody) {
  jsonProcessedResponses = [];
  for (let i=0; i<jsonResponsesBody.length; i++) {
    jsonProcessedResponses[i] =
      module.exports.getRelevantInformationFromUberResponse(
          jsonResponsesBody[i]
      );
  }
  return jsonProcessedResponses;
};

/**
 * Process a single search result and extract only relevant information
 * @param {jsonObject} jsonResponseBody -  single search result
 * @return {jsonObject} jsonProcessedResponseBody - single processed response
 */
exports.getRelevantInformationFromUberResponse = function(jsonResponseBody) {
  let jsonProcessedResponseBody = {
    ride_hailing_service: 'uber',
    display_name: jsonResponseBody.display_name,
    estimated_duration_seconds: jsonResponseBody.duration,
    estimated_distance_miles: jsonResponseBody.distance,
    estimated_cost_cents_min: jsonResponseBody.low_estimate*100,
    estimated_cost_cents_max: jsonResponseBody.high_estimate*100,
  };
  return jsonProcessedResponseBody;
};
