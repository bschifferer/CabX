const request = require('request');

const PRE_URL = 'http://dev.virtualearth.net/REST/v1/Autosuggest?query=';
const POST_URL = '&includeEntityTypes=Business,Address,Place&key=';
const BING_KEY = 'AjpMdmorYvx_955ltPZVK1BNYpGA0Dl' +
  '8YjGR2cNWh1PjTK0khLpjrtQKwSvrMv2f';

exports.getSuggestion = async function(sAddress) {
  let res = {};
  res['response'] = await module.exports.requestSuggestion(sAddress)
      .catch((err) => {
        console.error(err);
        res['error'] = err;
      });
  console.log(res['response'].resourceSets[0].resources[0].value);
  if (!res.hasOwnProperty('error')) {
    res['processedResponse'] =
      module.exports.processBingSuggestionResponse(res['response']);
  }
  return (res.processedResponse);
};


/**
 * Returns address suggestion based on a input address (string)
 * with Lat and Long.
 * @param {string} sAddress - Keyword for the address
 * @return {string} jsonObject - Response body from Bing
 */
exports.requestSuggestion = function(sAddress) {
  return new Promise(function(resolve, reject) {
    console.log(PRE_URL + encodeURIComponent(sAddress) + POST_URL + BING_KEY);
    request.get(PRE_URL + encodeURIComponent(sAddress) + POST_URL + BING_KEY,
        {json: true, timeout: 2500}, (err, res, body) => {
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
 * Process the response of a autosuggestion search with Bing
 * @param {jsonObject} jsonResponses - jsonObject of the response from bing
 * @return {jsonArray} jsonProcessedResponses - processed json array with
 */
exports.processBingSuggestionResponse = function(jsonResponses) {
  let res = {};
  if (
    !(jsonResponses.hasOwnProperty('resourceSets')) ||
    !(jsonResponses.resourceSets[0].hasOwnProperty('resources'))
  ) {
    console.error(jsonResponses);
    console.error('does not include all required fields');
    res['error'] = 'Response does not include all required fields';
  } else {
    res['response'] = jsonResponses.resourceSets[0].resources[0].value;
  }
  return (res);
};
