var assert = require('assert');
var lyft = require('../src/getLyft.js');

describe('getLyft.js', function() {
  describe('processLyftResponseBody()', function() {
    it('Processed jsonArray is not as expected', function() {
      input = [
        {display_name: 'Lyft SUV',
          estimated_distance_miles: 6.88,
          estimated_cost_cents_max: 7600,
          estimated_cost_cents_min: 6100,
          estimated_duration_seconds: 1920,
        },
        {display_name: 'Lyft SUV',
          estimated_distance_miles: 10,
          estimated_cost_cents_max: 10000,
          estimated_cost_cents_min: 8000,
          estimated_duration_seconds: 2000,
        },
        {display_name: 'Lyft Service',
          estimated_distance_miles: 20,
          estimated_cost_cents_max: 20000,
          estimated_cost_cents_min: 16000,
          estimated_duration_seconds: 4000,
        },
      ];
      expectedResponse = [
        {
          ride_hailing_service: 'lyft',
          display_name: 'Lyft SUV',
          estimated_duration_seconds: 1920,
          estimated_distance_miles: 6.88,
          estimated_cost_cents_min: 6100,
          estimated_cost_cents_max: 7600,
        },
        {
          ride_hailing_service: 'lyft',
          display_name: 'Lyft SUV',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 8000,
          estimated_cost_cents_max: 10000,
        },
        {
          ride_hailing_service: 'lyft',
          display_name: 'Lyft Service',
          estimated_duration_seconds: 4000,
          estimated_distance_miles: 20,
          estimated_cost_cents_min: 16000,
          estimated_cost_cents_max: 20000,
        },
      ];
      assert.deepEqual(lyft.processLyftResponseBody(input),
        expectedResponse);
    });
  });

  describe('getRelevantInformationFromLyftResponse()', function() {
    it('Processed jsonObject is not as expected', function() {
      input = {display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920};
      expectedResponse = {ride_hailing_service: 'lyft',
        display_name: 'Lyft Service',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 6100,
        estimated_cost_cents_max: 7600};
      assert.deepEqual(lyft.getRelevantInformationFromLyftResponse(input),
        expectedResponse);
    });
  });
});

