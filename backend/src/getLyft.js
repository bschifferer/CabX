const request = require('request');

const PRE_URL_LYFT = 'https://api.lyft.com/v1/cost?';

module.exports = {
  getLyftPrices: async function (fromLat, fromLong, toLat, toLong) {
    let response = await lyftPrices(fromLat, fromLong, toLat, toLong);
    processedResponses = processLyftResponseBody(JSON.parse(response).cost_estimates);
    return processedResponses;
  },
};

/**
 * Returns addresses based on a input address (string) with Lat and Loing.
 * @param {string} sAddress - Keyword for the address
 */
function lyftPrices(fromLat, fromLong, toLat, toLong) {
  var options = {
    url: PRE_URL_LYFT + 'start_lat=' + fromLat + '&start_lng=' +
      fromLong + '&end_lat=' + toLat + '&end_lng=' + toLong,
    headers: {
      'Authorization': 'bearer sG1iQES+ARRImYkpZAQZ7PnTJEBv8e7tRHG6E1AZWCtOr7aYO64C6BUhHbTav3p7JiMwA84pIYOCvYHQo+POUMfAIYFVkjbaqEhgcvzx3MOSiteK1Cxb+oE='
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
function processLyftResponseBody(jsonResponsesBody) {
  jsonProcessedResponses = [];
  for (let i=0; i<jsonResponsesBody.length; i++) {
    jsonProcessedResponses[i] = getRelevantInformationFromLyftResponse(
      jsonResponsesBody[i]);
  }
  return jsonProcessedResponses;
}

/**
 * Process a single search result and extract only relevant information
 * @param {jsonObject} jsonResponseBody -  single search result
 * @return {jsonObject} jsonProcessedResponseBody - single processed response
 */
function getRelevantInformationFromLyftResponse(jsonResponseBody) {
  let jsonProcessedResponseBody = {
    ride_hailing_service: 'lyft',
    display_name: jsonResponseBody.display_name,
    estimated_duration_seconds: jsonResponseBody.estimated_duration_seconds,
    estimated_distance_miles: jsonResponseBody.estimated_distance_miles,
    estimated_cost_cents_min: jsonResponseBody.estimated_cost_cents_min,
    estimated_cost_cents_max: jsonResponseBody.estimated_cost_cents_max
  };
  return jsonProcessedResponseBody;
}
