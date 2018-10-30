var assert = require('assert');
var nock = require('nock');
var expect = require('chai').expect;
var uber = require('../src/getUber.js');

describe('getUber.js', function() {
  describe('uberPrices()', function() {
    beforeEach(function() {
      var followersResponse = {
        prices:[
          {
            localized_display_name:"UberXL",
            distance:7.15,
            display_name:"UberXL",
            product_id:"1e0ce2df-4a1e-4333-86dd-dc0c67aaabe1",
            high_estimate:42.0,
            low_estimate:34.0,
            duration:1620,
            estimate:"$34-42",
            currency_code:"USD",
          },
          {
            localized_display_name:"UberX",
            distance:7.15,
            display_name:"UberX",
            product_id:"b8e5c464-5de2-4539-a35a-986d6e58f186",
            high_estimate:32.0,
            low_estimate:25.0,
            duration:1620,
            estimate:"$25-32",
            currency_code:"USD",
          },
          {
            localized_display_name:"Car Seat",
            distance:7.15,
            display_name:"Car Seat",
            product_id:"d6d6d7ad-67f9-43ef-a8de-86bd6224613a",
            high_estimate:43.0,
            low_estimate:34.0,
            duration:1620,
            estimate:"$34-43",
            currency_code:"USD",
          },
        ],
      };

      // Mock the TMDB configuration request response
      nock('https://api.uber.com')
        .get('/v1.2/estimates/price?start_latitude=40.8081588745117&start_longitude=-73.9636535644531&end_latitude=40.7483711242676&end_longitude=-73.9846420288086')
        .reply(200, followersResponse);
    });


    it('200 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await uber.uberPrices(fromLat, fromLong, toLat, toLong);
      expect(JSON.parse(responseBack).hasOwnProperty("prices")).to.equal(true);
    });
  });

  describe('processUberResponseBody()', function() {
    it('Processed jsonArray is not as expected', function() {
      input = [
        {display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920,
        },
        {display_name: 'Black SUV',
          distance: 10,
          high_estimate: 100,
          low_estimate: 80,
          duration: 2000,
        },
        {display_name: 'Black',
          distance: 20,
          high_estimate: 200,
          low_estimate: 160,
          duration: 4000,
        },
      ];
      expectedResponse = [
        {
        ride_hailing_service: 'uber',
        display_name: 'Black SUV',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 6100,
        estimated_cost_cents_max: 7600,
      },
        {
          ride_hailing_service: 'uber',
          display_name: 'Black SUV',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 8000,
          estimated_cost_cents_max: 10000,
        },
        {
          ride_hailing_service: 'uber',
          display_name: 'Black',
          estimated_duration_seconds: 4000,
          estimated_distance_miles: 20,
          estimated_cost_cents_min: 16000,
          estimated_cost_cents_max: 20000,
        },
      ];
      assert.deepEqual(uber.processUberResponseBody(input),
        expectedResponse);
    });
  });

  describe('getRelevantInformationFromUberResponse()', function() {
    it('Processed jsonObject is not as expected', function() {
      input = {display_name: 'Black SUV',
        distance: 6.88,
        high_estimate: 76,
        low_estimate: 61,
        duration: 1920};
      expectedResponse = {ride_hailing_service: 'uber',
        display_name: 'Black SUV',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 6100,
        estimated_cost_cents_max: 7600};
      assert.deepEqual(uber.getRelevantInformationFromUberResponse(input),
        expectedResponse);
    });
  });
});
