var latLong = require('./getLatLongFromAddress.js');
var lyft = require('./getLyft.js');
var uber = require('./getUber.js');

module.exports = {
  getFindRides: async function(sAddressFrom, sAddressTo) {
    let response = await findRides(sAddressFrom, sAddressTo);
    return response;
  },
};

/**
 * Returns all rides based on from address (string) and to address (string)
 * @param {string} sAddressFrom - Keyword for the from address
 * @param {string} sAddressTo - Keyword for the to address
 * @return {string} jsonArray - containing all found rides from-to with infos
 */
async function findRides(sAddressFrom, sAddressTo) {
  jsonFromResults = await latLong.getRequestLatLongFromAddress(sAddressFrom);
  jsonToResults = await latLong.getRequestLatLongFromAddress(sAddressTo);

  fromLat = jsonFromResults[0].lat;
  fromLong = jsonFromResults[0].long;
  toLat = jsonToResults[0].lat;
  toLong = jsonToResults[0].long;

  jsonUber = await uber.getUberPrices(fromLat, fromLong, toLat, toLong);
  jsonLyft = await lyft.getLyftPrices(fromLat, fromLong, toLat, toLong);

  response = jsonUber.concat(jsonLyft);
  return (response);
}
