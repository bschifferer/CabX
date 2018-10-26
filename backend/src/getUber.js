const request = require('request');

const PRE_URL_UBER = 'https://api.uber.com/v1.2/estimates/price?';

module.exports = {
  getUberPrices: async function (fromLat, fromLong, toLat, toLong) {
    let response = await uberPrices(fromLat, fromLong, toLat, toLong);
    processedResponses = processUberResponseBody(JSON.parse(response).prices);
    return processedResponses;
  },
};

/**
 * Returns addresses based on a input address (string) with Lat and Loing.
 * @param {string} sAddress - Keyword for the address
 */
function uberPrices(fromLat, fromLong, toLat, toLong) {
  var options = {
    url: PRE_URL_UBER + 'start_latitude=' + fromLat + '&start_longitude=' +
      fromLong + '&end_latitude=' + toLat + '&end_longitude=' + toLong,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Token cds-RMpAWPazEskuTK1gWxP7EAl_vyvBmT4jjKnY',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/json'
    }
  }
  return new Promise(function (resolve, reject) {
    request.get(options, function (error, response, body) {
      resolve(body);
    });
  });
}

/**
 * Process the response body of a geocoding search with Bing
 * @param {string} jsonResponsesBody - jsonObject - part of Bing response
 * @return {jsonObject} jsonProcessedResponses
 */
function processUberResponseBody(jsonResponsesBody) {
  jsonProcessedResponses = [];
  for (let i=0; i<jsonResponsesBody.length; i++) {
    jsonProcessedResponses[i] = getRelevantInformationFromUberResponse(
      jsonResponsesBody[i]);
  }
  return jsonProcessedResponses;
}

/**
 * Process a single search result and extract only relevant information
 * @param {jsonObject} jsonResponseBody -  single search result
 * @return {jsonObject} jsonProcessedResponseBody - single processed response
 */
function getRelevantInformationFromUberResponse(jsonResponseBody) {
  let jsonProcessedResponseBody = {
    ride_hailing_service: 'uber',
    display_name: jsonResponseBody.display_name,
    estimated_duration_seconds: jsonResponseBody.duration,
    estimated_distance_miles: jsonResponseBody.distance,
    estimated_cost_cents_min: jsonResponseBody.low_estimate*100,
    estimated_cost_cents_max: jsonResponseBody.high_estimate*100
  };
  return jsonProcessedResponseBody;
}
