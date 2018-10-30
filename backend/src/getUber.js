const request = require('request');

const PRE_URL_UBER = 'https://api.uber.com/v1.2/estimates/price?';


exports.getUberPrices = async function(fromLat, fromLong, toLat, toLong) {
  let res = {};
  res['response'] = await module.exports.uberPrices(fromLat, fromLong,
      toLat, toLong).catch((err) => {
    console.error(err);
    res['error'] = err;
  });
  if (!res.hasOwnProperty('error')) {
    res['processedResponse'] = module.exports.processUberResponseBody(
        JSON.parse(res['response']).prices);
  }
  return res;
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
    request.get(options, function(err, res, body) {
      if (err) {
        reject(err);
      }
      if (res.statusCode != 200) {
        reject(res.statusCode);
      }
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
  let jsonProcessedResponses = [];
  let j = 0;
  jsonProcessedResponses = [];
  for (let i=0; i<jsonResponsesBody.length; i++) {
    let res = module.exports.getRelevantInformationFromUberResponse(
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
exports.getRelevantInformationFromUberResponse = function(jsonResponseBody) {
  let res = {};
  if (
    !jsonResponseBody.hasOwnProperty('display_name') ||
    !jsonResponseBody.hasOwnProperty('duration') ||
    !jsonResponseBody.hasOwnProperty('distance') ||
    !jsonResponseBody.hasOwnProperty('low_estimate') ||
    !jsonResponseBody.hasOwnProperty('high_estimate')
  ) {
    console.error(jsonResponseBody);
    console.error('does not include all required fields');
    res['error'] = 'Response does not include all required fields';
  } else {
    res['response'] = {
      ride_hailing_service: 'uber',
      display_name: jsonResponseBody.display_name,
      estimated_duration_seconds: jsonResponseBody.duration,
      estimated_distance_miles: jsonResponseBody.distance,
      estimated_cost_cents_min: jsonResponseBody.low_estimate,
      estimated_cost_cents_max: jsonResponseBody.high_estimate,
    };
  }
  return (res);
};
