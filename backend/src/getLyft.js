const request = require('request');

const PRE_URL_LYFT = 'https://api.lyft.com/v1/cost?';

exports.getLyftPrices = async function(fromLat, fromLong, toLat, toLong) {
  let res = {};
  res['response'] = await module.exports.lyftPrices(fromLat, fromLong,
      toLat, toLong).catch((err) => {
    console.error(err);
    res['error'] = err;
  });
  if (!res.hasOwnProperty('error')) {
    res['processedResponse'] = module.exports.processLyftResponseBody(
        JSON.parse(res['response']).cost_estimates);
  }
  return res;
};

/**
 * Returns the ride sharing offers from Lyft based on From/To destination in
 * lat and long format
 * @param {integer} fromLat - Latitude value of from destination
 * @param {integer} fromLong - Longitude value of from destination
 * @param {integer} toLat - Latitude value of from destination
 * @param {integer} toLong - Longitude value of from destination
 * @return {jsonObject} fromLat - Response body from Lyft
 */
exports.lyftPrices = function(fromLat, fromLong, toLat, toLong) {
  var options = {
    url: PRE_URL_LYFT + 'start_lat=' + fromLat + '&start_lng=' +
      fromLong + '&end_lat=' + toLat + '&end_lng=' + toLong,
    headers: {
      'Authorization': 'bearer sG1iQES+ARRImYkpZAQZ7PnTJEBv8e' +
        '7tRHG6E1AZWCtOr7aYO64C6BUhHbTav3p7JiMwA84pIYOCvYHQo+POUMfAI' +
        'YFVkjbaqEhgcvzx3MOSiteK1Cxb+oE=',
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
 * Process the response body of a ride offer search with Lyft
 * @param {string} jsonResponsesBody - jsonObject - part of Lyft response
 * @return {jsonObject} jsonProcessedResponses - Processed responses as JSON
 */
exports.processLyftResponseBody = function(jsonResponsesBody) {
  let jsonProcessedResponses = [];
  let j = 0;
  for (let i=0; i<jsonResponsesBody.length; i++) {
    let res = module.exports.getRelevantInformationFromLyftResponse(
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
exports.getRelevantInformationFromLyftResponse = function(jsonResponseBody) {
  let res = {};
  if (
    !jsonResponseBody.hasOwnProperty('display_name') ||
    !jsonResponseBody.hasOwnProperty('estimated_duration_seconds') ||
    !jsonResponseBody.hasOwnProperty('estimated_distance_miles') ||
    !jsonResponseBody.hasOwnProperty('estimated_cost_cents_min') ||
    !jsonResponseBody.hasOwnProperty('estimated_cost_cents_max')
  ) {
    console.error(jsonResponseBody);
    console.error('does not include all required fields');
    res['error'] = 'Response does not include all required fields';
  } else {
    res['response'] = {
      ride_hailing_service: 'lyft',
      display_name: jsonResponseBody.display_name,
      estimated_duration_seconds: jsonResponseBody.estimated_duration_seconds,
      estimated_distance_miles: jsonResponseBody.estimated_distance_miles,
      estimated_cost_cents_min: jsonResponseBody.estimated_cost_cents_min / 100,
      estimated_cost_cents_max: jsonResponseBody.estimated_cost_cents_max / 100,
    };
  }
  return (res);
};
