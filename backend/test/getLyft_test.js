var assert = require('assert');
var lyft = require('../src/getLyft.js');
var expect = require('chai').expect;
var nock = require('nock');

describe('getLyft.js', function() {
  describe('getRelevantInformationFromLyftResponse()', function() {
    it('success - standard case', function() {
      input = {display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920};
      let expectedResponse = {};
      expectedResponse['response'] = {ride_hailing_service: 'lyft',
        display_name: 'Lyft Service',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 61,
        estimated_cost_cents_max: 76};
      let output = lyft.getRelevantInformationFromLyftResponse(input)
      assert.deepEqual(output, expectedResponse);
      expect(output.hasOwnProperty("error")).to.equal(false);
    });

    it('error - missing display_name', function() {
      input = {
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920};
      let output = lyft.getRelevantInformationFromLyftResponse(input);
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing estimated_distance_miles', function() {
      input = {display_name: 'Lyft Service',
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920};
      let output = lyft.getRelevantInformationFromLyftResponse(input);
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing estimated_cost_cents_max', function() {
      input = {display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920};
      let output = lyft.getRelevantInformationFromLyftResponse(input);
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing estimated_cost_cents_min', function() {
      input = {display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_duration_seconds: 1920};
      let output = lyft.getRelevantInformationFromLyftResponse(input);
      expect(output.hasOwnProperty("error")).to.equal(true);
    });

    it('error - missing estimated_duration_seconds', function() {
      input = {display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100};
      let output = lyft.getRelevantInformationFromLyftResponse(input);
      expect(output.hasOwnProperty("error")).to.equal(true);
    });
  });

  describe('processLyftResponseBody()', function() {
    it('success - standard case', function() {
      input = [{display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100,
        estimated_duration_seconds: 1920},
        {display_name: 'Lyft Service 2',
          estimated_distance_miles: 10,
          estimated_cost_cents_max: 10000,
          estimated_cost_cents_min: 8000,
          estimated_duration_seconds: 2000},
        ];
      let expectedResponse = {};
      expectedResponse = [{ride_hailing_service: 'lyft',
        display_name: 'Lyft Service',
        estimated_duration_seconds: 1920,
        estimated_distance_miles: 6.88,
        estimated_cost_cents_min: 61,
        estimated_cost_cents_max: 76},
        {ride_hailing_service: 'lyft',
          display_name: 'Lyft Service 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 80,
          estimated_cost_cents_max: 100}];
      let output = lyft.processLyftResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('success empty input', function() {
      input = [];
      let expectedResponse = {};
      expectedResponse = [];
      let output = lyft.processLyftResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('error one wrong, one correct', function() {
      input = [{display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100},
        {display_name: 'Lyft Service 2',
          estimated_distance_miles: 10,
          estimated_cost_cents_max: 10000,
          estimated_cost_cents_min: 8000,
          estimated_duration_seconds: 2000},
      ];
      let expectedResponse = {};
      expectedResponse = [
        {ride_hailing_service: 'lyft',
          display_name: 'Lyft Service 2',
          estimated_duration_seconds: 2000,
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 80,
          estimated_cost_cents_max: 100}];
      let output = lyft.processLyftResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });

    it('error two wrong', function() {
      input = [{display_name: 'Lyft Service',
        estimated_distance_miles: 6.88,
        estimated_cost_cents_max: 7600,
        estimated_cost_cents_min: 6100},
        {display_name: 'Lyft Service 2',
          estimated_distance_miles: 10,
          estimated_cost_cents_min: 8000,
          estimated_duration_seconds: 2000},
      ];
      let expectedResponse = {};
      expectedResponse = [];
      let output = lyft.processLyftResponseBody(input)
      assert.deepEqual(output, expectedResponse);
    });
  });

  describe('lyftPrices() success', function() {
    beforeEach(function() {
      var lyftResponse = {
        cost_estimates:[],
      };

      // Mock the TMDB configuration request response
      nock('https://api.lyft.com')
        .get('/v1/cost?start_lat=40.8081588745117&start_lng=-73.9636535644531&end_lat=40.7483711242676&end_lng=-73.9846420288086')
        .reply(200, lyftResponse);
    });


    it('200 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await lyft.lyftPrices(fromLat, fromLong, toLat, toLong);
      expect(JSON.parse(responseBack).hasOwnProperty("cost_estimates")).to.equal(true);
    });
  });

  describe('lyftPrices() error', function() {
    beforeEach(function() {
      var lyftResponse = {};

      // Mock the TMDB configuration request response
      nock('https://api.lyft.com')
        .get('/v1/cost?start_lat=40.8081588745117&start_lng=-73.9636535644531&end_lat=40.7483711242676&end_lng=-73.9846420288086')
        .reply(500, lyftResponse);
    });


    it('500 response code', async function() {
      fromLat = 40.8081588745117;
      fromLong = -73.9636535644531;
      toLat = 40.7483711242676;
      toLong = -73.9846420288086;
      let responseBack = await lyft.lyftPrices(fromLat, fromLong, toLat, toLong);
      assert.deepEqual(JSON.parse(responseBack),{});
    });
  });

});

