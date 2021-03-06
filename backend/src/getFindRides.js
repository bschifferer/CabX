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

  if (sAddressFrom === '') {
    res['error'] = 'The from address is was empty';
    return (res);
  }

  if (sAddressTo === '') {
    res['error'] = 'The to address is was empty';
    return (res);
  }

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

  fromLat = jsonFromResults.processedResponse.jsonProcessedResponses[0].lat;
  fromLong = jsonFromResults.processedResponse.jsonProcessedResponses[0].long;
  fromName = jsonFromResults.processedResponse.jsonProcessedResponses[0].name;
  toLat = jsonToResults.processedResponse.jsonProcessedResponses[0].lat;
  toLong = jsonToResults.processedResponse.jsonProcessedResponses[0].long;
  toName = jsonToResults.processedResponse.jsonProcessedResponses[0].name;

  jsonUber = await uber.getUberPrices(fromLat, fromLong, toLat, toLong);
  jsonLyft = await lyft.getLyftPrices(fromLat, fromLong, toLat, toLong);
  if (
    !(jsonUber.hasOwnProperty('error')) &&
    !(jsonLyft.hasOwnProperty('error'))) {
    res = jsonUber['processedResponse'].concat(jsonLyft['processedResponse']);
  } else if (!(jsonUber.hasOwnProperty('error'))) {
    res = jsonUber['processedResponse'];
  } else if (!(jsonLyft.hasOwnProperty('error'))) {
    res = jsonLyft['processedResponse'];
  }

  if (res.length === 0) {
    return ({'error': 'No results could be found for this route!'});
  }

  res = {res: res,
    from: {
      name: fromName,
      lat: fromLat,
      long: fromLong,
      requestedKeyword: sAddressFrom},
    to: {name: toName, lat: toLat, long: toLong, requestedKeyword: sAddressTo}};
  return (res);
};
