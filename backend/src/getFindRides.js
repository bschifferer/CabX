var latLong = require('./getLatLongFromAddress.js');
var lyft = require('./getLyft.js');
var uber = require('./getUber.js');

/**
 * Returns all rides based on from address (string) and to address (string)
 * @param {string} sAddressFrom - Keyword for the from address
 * @param {string} sAddressTo - Keyword for the to address
 * @return {string} jsonArray - containing all found rides from-to with infos or
 * error msg
 */
exports.findRides = async function(sAddressFrom, sAddressTo) {
  let res = {};

  jsonFromResults = await latLong.getRequestLatLongFromAddress(sAddressFrom);
  if (jsonFromResults.hasOwnProperty('error')) {
    res['error'] = 'An error occured by processing the from address';
    return (res);
  }
  if (jsonFromResults.processedResponse.jsonProcessedResponses.length == 0) {
    res['error'] = 'From address was not found!';
    return (res);
  }

  jsonToResults = await latLong.getRequestLatLongFromAddress(sAddressTo);
  if (jsonToResults.hasOwnProperty('error')) {
    res['error'] = 'An error occured by processing the to address';
    return (res);
  }
  if (jsonToResults.processedResponse.jsonProcessedResponses == 0) {
    res['error'] = 'To address was not found!';
    return (res);
  }

  console.log(jsonToResults.processedResponse.jsonProcessedResponses);

  fromLat = jsonFromResults.processedResponse.jsonProcessedResponses[0].lat;
  fromLong = jsonFromResults.processedResponse.jsonProcessedResponses[0].long;
  toLat = jsonToResults.processedResponse.jsonProcessedResponses[0].lat;
  toLong = jsonToResults.processedResponse.jsonProcessedResponses[0].long;

  jsonUber = await uber.getUberPrices(fromLat, fromLong, toLat, toLong);
  jsonLyft = await lyft.getLyftPrices(fromLat, fromLong, toLat, toLong);
  if (
    !(jsonUber.hasOwnProperty('error')) &&
    !(jsonLyft.hasOwnProperty('error'))) {
    res = jsonUber['processedResponse'].concat(jsonLyft['processedResponse']);
    return (res);
  }
  if (!(jsonUber.hasOwnProperty('error'))) {
    res = jsonUber['processedResponse'];
    return (res);
  }
  if (!(jsonLyft.hasOwnProperty('error'))) {
    res = jsonLyft['processedResponse'];
    return (res);
  }
  return (res);
};
