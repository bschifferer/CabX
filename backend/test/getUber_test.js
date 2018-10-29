var assert = require('assert');
var uber = require('../src/getUber.js');

describe('getUber.js', function() {



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
